import {Router, Request, Response} from "express";

import userApiController from "../controllers/userApiController";
const router = Router();

router.get("/", userApiController.getAllUsers);
router.post("/", userApiController.createUser);
router.put("/:id", userApiController.updateUser);


export default router;