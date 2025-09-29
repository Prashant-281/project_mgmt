import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            const error = new Error("User already exists");
            res.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
        const newUser = newUsers[0];
        console.log("before siiiiiiiiign", JWT_SECRET)
        console.log("before siiiiiiiiign", JWT_EXPIRES_IN)
        const token = jwt.sign(
            { userId: newUser._id.toString() },
            JWT_SECRET as string, 
            { expiresIn: Number(JWT_EXPIRES_IN) as number}
        );

        await session.commitTransaction();
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser,
            }
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            res.statusCode = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            res.statusCode = 401;
            throw error;
        }
       
        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET as string,
            { expiresIn: Number(JWT_EXPIRES_IN) as number } 
        );

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user,
            }
        });
    } catch (error) {
        next(error);
    }
};