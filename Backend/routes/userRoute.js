import express from "express";
import { loginUser, registerUser, adminLogin, getUser, updateUser } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// ✅ fixed route
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

userRouter.post('/single',authUser, getUser);
userRouter.post('/update',authUser, updateUser);

export default userRouter;
