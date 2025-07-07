import authApiController from "../controllers/authApiController";
import {Router} from "express";

const router = Router();

router.post("/register", authApiController.register);
router.post("/login", authApiController.login);
router.post("/logout", authApiController.logout);


export default router;
