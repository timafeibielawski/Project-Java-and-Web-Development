import express from 'express';
import {SneakersService} from "../services/sneakers.service";
import multer from 'multer';
import path from 'path';
import {v4 as uuid} from "uuid"

const router = express.Router();
const service = new SneakersService();

const upload = multer(
    {
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                cb(null, uuid() + path.extname(file.originalname));
            }
        })
    },
);

router.get('/', service.getAll)
router.get('/:id', service.getById)
router.post('/', upload.single("image"), service.create)
router.put('/:id', upload.single("image"), service.update)
router.delete('/:id', service.delete)

export default router;
