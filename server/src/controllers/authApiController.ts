import { Request, Response } from "express";
import { User } from "../models/User";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, firstName, password } = req.body;

        if(!email || !username || !firstName ||  !password) throw new Error('All fields are required');

        const newUser = await User.create({
            email,
            username,
            firstName,
            password
        });
        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default { register };