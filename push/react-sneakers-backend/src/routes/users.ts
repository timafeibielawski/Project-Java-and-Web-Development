import express from 'express';
import {UserService} from '../services/user.service';
import {authenticateToken} from "../middlewares/auth.middleware";

const router = express.Router();
const service = new UserService();

router.get('/', service.getAll)
router.get('/:id', service.getById)
// router('/users/:id', service.update())
router.delete('/:id', service.delete)
router.get("/favorite/:id", authenticateToken,service.addToFavorite)
router.get("/cart/:id", authenticateToken,service.addToCart)


export default router;
