import express, {NextFunction} from "express";
import {AuthService} from "../services/auth.service";
import {authenticateToken} from "../middlewares/auth.middleware";
import {RequestWithUser} from "../types/request.interface";
// import { Response} from "express";
const router = express.Router();
const service = new AuthService();

interface ResponseWithUser extends Response {
    user: any
}

router.post('/register', service.register)
router.post('/login', service.login)
router.get('/me', authenticateToken, (req, res) => service.me(req, res))
router.get('/logout', service.signOut)
router.get('/refresh', service.refresh)

export default router;
