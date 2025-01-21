import {prisma} from "../index";
import bcrypt from "bcrypt";
import {Request, Response} from "express";
import {RequestWithUser} from "../types/request.interface";

export class UserService {
    async getAll(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany()
            return res.json(users)
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const {id} = req.params

            if (!id) {
                return res.status(400).json({message: 'Id not found'})
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: id,
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

            if (!user) {
                return res.status(404).json({message: 'User not found'})
            }

            return res.json(user)
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params

            if (!id) {
                return res.status(400).json({message: 'Id not found'})
            }

            await prisma.user.delete({
                where: {
                    id: id,
                }
            })

            return res.json({message: 'User deleted'})
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async addToFavorite(req: RequestWithUser, res: Response) {
        try {
            const {id: productId} = req.params
            const userId = req.user?.userId

            if (!userId) {
                return res.status(400).json({message: 'Id not found'})
            }

            if (!productId) {
                return res.status(400).json({message: 'Id not found'})
            }

            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                }
            })

            if (!product) {
                return res.status(404).json({message: 'Product not found'})
            }

            const favoriteExict = await prisma.favorite.findFirst({
                where: {
                    productId: productId,
                    userId: userId,
                }
            })

            if (favoriteExict) {
                await prisma.favorite.delete({
                    where: {
                        id: favoriteExict.id,
                    }
                })

                return res.json({message: 'Product removed from favorite'})
            } else {
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        favorite: {
                            create: {
                                productId: productId,
                            }
                        }
                    }
                })
                return res.json({message: 'Product added to favorite'})
            }
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async addToCart(req: RequestWithUser, res: Response) {
        try {
            const {id: productId} = req.params
            const userId = req.user?.userId

            if (!userId) {
                return res.status(400).json({message: 'Id not found'})
            }

            if (!productId) {
                return res.status(400).json({message: 'Id not found'})
            }

            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                }
            })

            if (!product) {
                return res.status(404).json({message: 'Product not found'})
            }

            const cartExict = await prisma.cart.findFirst({
                where: {
                    productId: productId,
                    userId: userId,
                }
            })

            if(cartExict) {
                await prisma.cart.delete({
                    where: {id: cartExict.id}
                })

                return res.json({message: 'Product removed from cart'})
            }else {
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        cart: {
                            create: {
                                productId: productId,
                            }
                        }
                    }
                })
                return res.json({message: 'Product added to cart'})
            }

        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }
}