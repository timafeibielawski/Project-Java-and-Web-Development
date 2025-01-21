import {Request, Response} from "express";
import {prisma} from "../index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {RequestWithUser} from "../types/request.interface";


export class AuthService {
    constructor() {
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.signOut = this.signOut.bind(this);
        this.me = this.me.bind(this);
        this.refresh = this.refresh.bind(this);
    }
    async register(req: Request, res: Response) {
        try{
            const {name, email, password} = req.body

            if (!name || !email || !password) {
                return res.status(400).json({message: 'Invalid input'})
            }

            const existUser = await prisma.user.findUnique({
                where: {email: email}
            })

            if(existUser) {
                return  res.status(400).json({message: 'User already exists'})
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    favorite: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    description: true,
                                    createdAt: true,
                                }
                            }
                        }
                    },
                    cart: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    description: true,
                                    createdAt: true,
                                }
                            }
                        }
                    }
                }
            })

            return await  this.IssueTokens(user, res)
        }catch (e: any) {
            return  res.status(500).json({message: e.message})
        }
    }

    async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body

            if (!email || !password) {
                return res.status(400).json({message: 'Invalid input'})
            }
            
            const user = await prisma.user.findUnique({
                where: {email: email},
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    createdAt: true,
                    favorite: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    description: true,
                                    createdAt: true,
                                }
                            }
                        }
                    },
                    cart: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    description: true,
                                    createdAt: true,
                                }
                            }
                        }
                    }
                }
            })
            console.log(user)   
            if (!user) {
                return res.status(400).json({message: 'Invalid credentials'})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return res.status(400).json({message: 'Invalid credentials'})
            }

            return await this.IssueTokens(user, res)
        }catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }
    async IssueTokens(user: any, res: Response) {
        const jwtSecret = process.env.JWT_SECRET || 'some-secret-token';
        const accessToken = jwt.sign(
            {userId: user.id},
            jwtSecret,
            {expiresIn: '15m'}
        )
        const refreshToken = jwt.sign(
            {userId: user.id},
            jwtSecret,
            {expiresIn: '7d'}
        )
        res.cookie('access-token', accessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true
        })
        res.cookie('refresh-token', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.json({user, accessToken, refreshToken})
    }

    async signOut(req: Request, res: Response) {
        res.clearCookie('access-token');
        res.clearCookie('refresh-token');

        return res.json({message: 'Signed out'});
    }

    async me(req: RequestWithUser, res: Response) {
        try {
            const userId = req.user?.userId;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    favorite: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    description: true,
                                    createdAt: true,
                                }
                            }
                        }
                    },
                    cart: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    description: true,
                                    createdAt: true,
                                }
                            }
                        }
                    }
                }
            });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            return await this.IssueTokens(user, res);
        }catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async refresh(req: Request, res: Response) {
        try {

            const token = req.cookies['refresh-token']

            if (!token) {
                return res.status(400).json({message: 'Invalid token'})
            }

            const payload = jwt.decode(token)

            if (!payload || typeof payload === 'string') {
                return res.status(400).json({message: 'Invalid token'})
            }

            const user = await prisma.user.findUnique({
                where: {id: payload.userId}
            })

            if (!user) {
                return res.status(400).json({message: 'Invalid token'})
            }

            return await this.IssueTokens(user, res)
        }catch (e: any) {
            return  res.status(500).json({message: e.message})
        }
    }
}