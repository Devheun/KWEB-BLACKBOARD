import * as express from "express";
import { ApplyController } from "../controller/apply";


const router = express.Router();


router.post("/:course_id", ApplyController.apply);
router.get("/:course_id", ApplyController.getStudents);
router.delete("/:student_id", ApplyController.deleteApply);

export {router as applyRouter};