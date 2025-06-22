import {Router, Request, Response} from "express";

import { User } from "../models/User";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;