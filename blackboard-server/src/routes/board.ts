import * as express from "express";
import { BoardController } from "../controller/board";

const router = express.Router();

router.post("/", BoardController.register);
router.get("/", BoardController.getAllBoards);
router.get("/:course_id", BoardController.getBoardsByCourseId);
router.get("/board/:board_id", BoardController.getBoardByBoardId);

export { router as boardRouter };
