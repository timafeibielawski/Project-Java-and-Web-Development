import { Request, Response } from "express";
import { prisma } from "../index"; // Prisma client for database access
import bcrypt from "bcrypt"; // Library for hashing and comparing passwords
import jwt from "jsonwebtoken"; // Library for generating JSON Web Tokens
import { RequestWithUser } from "../types/request.interface"; // Custom request type for user

export class AuthService {
    constructor() {
        // Bind methods to preserve context
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.signOut = this.signOut.bind(this);
        this.me = this.me.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    // Register a new user
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            // Validate input
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            // Check if user already exists
            const existUser = await prisma.user.findUnique({ where: { email } });
            if (existUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user in the database
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    favorite: {
                        select: { product: { select: { id: true, name: true, price: true, image: true, description: true, createdAt: true } } }
                    },
                    cart: {
                        select: { product: { select: { id: true, name: true, price: true, image: true, description: true, createdAt: true } } }
                    }
                }
            });

            // Generate tokens and respond
            return await this.IssueTokens(user, res);
        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }
    }

    // Log in an existing user
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    createdAt: true,
                    favorite: {
                        select: { product: { select: { id: true, name: true, price: true, image: true, description: true, createdAt: true } } }
                    },
                    cart: {
                        select: { product: { select: { id: true, name: true, price: true, image: true, description: true, createdAt: true } } }
                    }
                }
            });

            // Check if user exists and validate password
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate tokens and respond
            return await this.IssueTokens(user, res);
        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }
    }

    // Issue access and refresh tokens
    async IssueTokens(user: any, res: Response) {
        const jwtSecret = process.env.JWT_SECRET || 'some-secret-token';

        // Generate access token
        const accessToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '15m' });

        // Generate refresh token
        const refreshToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

        // Set tokens in cookies
        res.cookie('access-token', accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
        res.cookie('refresh-token', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

        return res.json({ user, accessToken, refreshToken });
    }

    // Sign out the user
    async signOut(req: Request, res: Response) {
        res.clearCookie('access-token');
        res.clearCookie('refresh-token');
        return res.json({ message: 'Signed out' });
    }

    // Fetch the current authenticated user
    async me(req: RequestWithUser, res: Response) {
        try {
            const userId = req.user?.userId;

            // Find user by ID
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    favorite: {
                        select: { product: { select: { id: true, name: true, price: true, image: true, description: true, createdAt: true } } }
                    },
                    cart: {
                        select: { product: { select: { id: true, name: true, price: true, image: true, description: true, createdAt: true } } }
                    }
                }
            });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Generate tokens and respond
            return await this.IssueTokens(user, res);
        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }
    }

    // Refresh tokens
    async refresh(req: Request, res: Response) {
        try {
            const token = req.cookies['refresh-token'];

            if (!token) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Decode the token
            const payload = jwt.decode(token);

            if (!payload || typeof payload === 'string') {
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Find user by ID from the token payload
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });

            if (!user) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Generate tokens and respond
            return await this.IssueTokens(user, res);
        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }
    }
}
