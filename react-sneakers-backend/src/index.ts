import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {PrismaClient} from "@prisma/client";
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import sneakersRouter from "./routes/sneakers";
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';

export const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 4000;
// Initialize the Express application.
const app = express();
export const prisma = new PrismaClient();
dotenv.config();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/uploads",express.static(path.join(__dirname, "..",'/uploads')));


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use("/sneakers", sneakersRouter)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})