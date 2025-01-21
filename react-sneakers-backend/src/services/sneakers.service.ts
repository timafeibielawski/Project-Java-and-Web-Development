import { prisma } from "../index"; // Prisma client for database operations
import { Request, Response } from "express"; // Types for request and response

export class SneakersService {
    // Get all sneakers
    async getAll(req: Request, res: Response) {
        try {
            const sneakers = await prisma.product.findMany(); // Fetch all products
            return res.json(sneakers); // Respond with the list of sneakers
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Get a sneaker by its ID
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params; // Extract ID from request parameters

            if (!id) {
                return res.status(400).json({ message: 'Invalid input' }); // Validate ID
            }

            const sneaker = await prisma.product.findUnique({
                where: { id: id }, // Find product by ID
            });

            if (!sneaker) {
                return res.status(404).json({ message: 'Sneaker not found' }); // Handle not found
            }

            return res.json(sneaker); // Respond with the sneaker data
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Create a new sneaker
    async create(req: Request, res: Response) {
        try {
            const { name, description, price } = req.body; // Extract data from the request body
            const image = req.file; // Extract file from the request (e.g., using multer)

            if (!name || !description || !price) {
                return res.status(400).json({ message: 'Invalid input' }); // Validate input
            }

            const sneaker = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: +price, // Convert price to a number
                    image: image?.path || "", // Use uploaded file path or an empty string
                },
            });

            return res.json(sneaker); // Respond with the created sneaker
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Update an existing sneaker
    async update(req: Request, res: Response) {
        try {
            const { name, description, price } = req.body; // Extract data from the request body
            const { id } = req.params; // Extract ID from request parameters
            const image = req.file; // Extract file from the request

            // Find the existing sneaker
            const sneaker = await prisma.product.findUnique({
                where: { id: id },
            });

            if (!sneaker) {
                return res.status(404).json({ message: 'Sneaker not found' }); // Handle not found
            }

            // Update the sneaker with new or existing data
            const updatedSneaker = await prisma.product.update({
                where: { id: id },
                data: {
                    name: name || sneaker.name,
                    description: description || sneaker.description,
                    price: price || sneaker.price,
                    image: image?.path || sneaker.image,
                },
            });

            return res.json(updatedSneaker); // Respond with the updated sneaker
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }

    // Delete a sneaker by its ID
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params; // Extract ID from request parameters

            if (!id) {
                return res.status(400).json({ message: 'Invalid input' }); // Validate ID
            }

            // Find the sneaker
            const sneaker = await prisma.product.findUnique({
                where: { id: id },
            });

            if (!sneaker) {
                return res.status(404).json({ message: 'Sneaker not found' }); // Handle not found
            }

            // Delete the sneaker
            await prisma.product.delete({
                where: { id: id },
            });

            return res.json({ message: 'Sneaker deleted' }); // Respond with a success message
        } catch (e: any) {
            return res.status(500).json({ message: e.message }); // Handle server errors
        }
    }
}
