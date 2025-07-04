import {Router} from "express";
import userApiController from "../controllers/userApiController";

const router = Router();


router.get("/", userApiController.getAllUsers);
router.put("/:id", userApiController.updateUser);


export default router;