import { User } from "../models/User";
import { Request, Response } from "express";
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        if(!users) throw new Error('No users found');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, username, firstName, lastName, password } = req.body;

        const newUser = await User.create({
            email,
            username,
            firstName,
            lastName,
            password
        });
        res.status(201).json(newUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void>  => {
    try {
        const { id } = req.params;
        const fieldsToUpdate = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return 
        }

        await user.update(fieldsToUpdate);

        res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export default { getAllUsers, getUserById, createUser, updateUser};