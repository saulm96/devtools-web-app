import authApiController from "../controllers/authApiController";
import {Router} from "express";

const router = Router();

router.post("/register", authApiController.register);


export default router;
