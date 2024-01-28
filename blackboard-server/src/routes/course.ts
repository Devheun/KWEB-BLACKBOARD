import expresss from "express";
import { CourseController } from "../controller/course";
import { Course } from "../entity/Course";
const router = expresss.Router();

router.post("/", CourseController.addCourse); // 교수가 강의 등록
router.get("/professor", CourseController.getProfCourses); // 교수가 본인 개설 강의 조회
router.get("/", CourseController.getCourses); // 전체 강의 조회 (학생, 교수 공통, 로그인 필요 X)
router.get("/student", CourseController.getStuCourses); // 학생이 수강 중인 강의 조회

export { router as courseRouter };
