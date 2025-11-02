import express from 'express';
import { createUser, getUserProfile, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post('/', createUser);
userRouter.get('/',getUserProfile)
userRouter.post('/login',loginUser)

export default userRouter; // eslint-disable-line

