import * as express from "express";
import { UserController } from "../controller/auth";


const router = express.Router();


router.post("/sign-up", UserController.sign_up); // POST, PUT, DELETE, GET
router.post("/sign-in", UserController.sign_in);

export {router as authRouter};