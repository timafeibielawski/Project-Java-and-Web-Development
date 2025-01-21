import { prisma } from "../index"; // Prisma client for database access
import { Request, Response } from "express"; // Types for request and response
import { RequestWithUser } from "../types/request.interface"; // Custom request type for authenticated users

export class UserService {
    // Fetch all users
    async getAll(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany(); // Retrieve all users
            return res.json(users); // Respond with the list of users
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Fetch a user by their ID
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params; // Extract user ID from request parameters

            if (!id) {
                return res.status(400).json({ message: 'Id not found' }); // Validate input
            }

            const user = await prisma.user.findUnique({
                where: { id },
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
                return res.status(404).json({ message: 'User not found' }); // Handle user not found
            }

            return res.json(user); // Respond with user details
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Delete a user by their ID
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params; // Extract user ID from request parameters

            if (!id) {
                return res.status(400).json({ message: 'Id not found' }); // Validate input
            }

            await prisma.user.delete({ where: { id } }); // Delete the user

            return res.json({ message: 'User deleted' }); // Respond with success message
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Add or remove a product from the user's favorites
    async addToFavorite(req: RequestWithUser, res: Response) {
        try {
            const { id: productId } = req.params; // Extract product ID
            const userId = req.user?.userId; // Extract user ID from authenticated request

            if (!userId || !productId) {
                return res.status(400).json({ message: 'Id not found' }); // Validate input
            }

            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' }); // Handle product not found
            }

            const favoriteExists = await prisma.favorite.findFirst({
                where: { productId, userId },
            });

            if (favoriteExists) {
                // Remove from favorites if already exists
                await prisma.favorite.delete({ where: { id: favoriteExists.id } });
                return res.json({ message: 'Product removed from favorite' });
            } else {
                // Add to favorites if not already present
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        favorite: {
                            create: { productId },
                        }
                    }
                });
                return res.json({ message: 'Product added to favorite' });
            }
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Add or remove a product from the user's cart
    async addToCart(req: RequestWithUser, res: Response) {
        try {
            const { id: productId } = req.params; // Extract product ID
            const userId = req.user?.userId; // Extract user ID from authenticated request

            if (!userId || !productId) {
                return res.status(400).json({ message: 'Id not found' }); // Validate input
            }

            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' }); // Handle product not found
            }

            const cartExists = await prisma.cart.findFirst({
                where: { productId, userId },
            });

            if (cartExists) {
                // Remove from cart if already exists
                await prisma.cart.delete({ where: { id: cartExists.id } });
                return res.json({ message: 'Product removed from cart' });
            } else {
                // Add to cart if not already present
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        cart: {
                            create: { productId },
                        }
                    }
                });
                return res.json({ message: 'Product added to cart' });
            }
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }
}
