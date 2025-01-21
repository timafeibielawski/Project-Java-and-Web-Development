import {prisma} from "../index";
import bcrypt from "bcrypt";
import {Request, Response} from "express";

export class SneakersService {
    async getAll(req: Request, res: Response) {
        try {
            const sneakers = await prisma.product.findMany()
            return res.json(sneakers)
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const {id} = req.params

            if (!id) {
                return res.status(400).json({message: 'Invalid input'})
            }

            const sneaker = await prisma.product.findUnique({
                where: {
                    id: id,
                },
            })

            if (!sneaker) {
                return res.status(404).json({message: 'Sneaker not found'})
            }

            return res.json(sneaker)
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async create(req: Request, res: Response) {
        try {
            const {name, description, price} = req.body
            const image = req.file

            if (!name || !description || !price) {
                return res.status(400).json({message: 'Invalid input'})
            }

            const sneaker = await prisma.product.create({
                data: {
                    name: name,
                    description: description,
                    price: +price,
                    image: image?.path || "",
                }
            })

            return res.json(sneaker)
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async update(req: Request, res: Response) {
        try {
            const {name, description, price} = req.body
            const {id} = req.params
            const image = req.file

            const sneaker = await prisma.product.findUnique({
                where: {
                    id: id,
                }
            })

            if (!sneaker) {
                return res.status(404).json({message: 'Sneaker not found'})
            }

            const updatedSneaker = await prisma.product.update({
                where: {
                    id: id,
                },
                data: {
                    name: name || sneaker.name,
                    description: description || sneaker.description,
                    price: price || sneaker.price,
                    image: image?.path || sneaker.image,
                }
            })

            return res.json(updatedSneaker)
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params

            if (!id) {
                return res.status(400).json({message: 'Invalid input'})
            }

            const sneaker = await prisma.product.findUnique({
                where: {
                    id: id,
                }
            })

            if (!sneaker) {
                return res.status(404).json({message: 'Sneaker not found'})
            }

            await prisma.product.delete({
                where: {
                    id: id,
                }
            })

            return res.json({message: 'Sneaker deleted'})
        } catch (e: any) {
            return res.status(500).json({message: e.message})
        }
    }
}