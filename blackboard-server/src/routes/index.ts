import * as express from "express";
import { authRouter } from "./auth";
import { courseRouter } from "./course";
import { applyRouter } from "./apply";
import {boardRouter} from "./board";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/apply", applyRouter);
router.use("/board", boardRouter);

export { router as routes };
