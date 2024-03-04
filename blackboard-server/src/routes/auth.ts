import * as express from "express";
import { UserController } from "../controller/auth";

const router = express.Router();

router.post("/sign-up", UserController.sign_up);
router.post("/sign-in", UserController.sign_in);
router.post("/logout", UserController.logout);

// refresh token 검증 후 새로운 access token 발급
router.post("/refresh", UserController.refresh);

export { router as authRouter };
