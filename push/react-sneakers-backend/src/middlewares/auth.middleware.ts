import jwt from 'jsonwebtoken';
import {NextFunction, Response} from "express";
import {RequestWithUser} from "../types/request.interface";

export function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.cookies['access-token']
    if (token == null) return res.sendStatus(401)
    const isVerify = jwt.verify(token, process.env.TOKEN_SECRET as string)
    if(!isVerify) return res.sendStatus(403)
    const userId = isVerify && typeof isVerify !== "string" && isVerify?.userId
    req.user = {userId: userId}
    next()
}