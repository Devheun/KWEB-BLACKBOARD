import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Course } from "../entity/Course";
import { User } from "../entity/User";
import { Apply } from "../entity/Apply";
import { authenticateProfessor } from "../service/checkIdentity";
import { authenticateStudent } from "../service/checkIdentity";

// Express.User 타입을 확장하여 id 속성을 추가 (passport는 Express.User 타입을 사용하는데 ts는 그게 없기때문에 설정해줘야함)
declare global {
  namespace Express {
    interface User {
      id?: number;
    }
  }
}

export class CourseController {
  // 교수가 강의 등록
  static async addCourse(req: Request, res: Response, next: NextFunction) {
    authenticateProfessor(req, res, async () => {
      try {
        const { course_name, course_number } = req.body;
        const course = new Course();
        course.course_name = course_name;
        course.course_number = course_number;
        course.professor_id = req.user?.id;

        const course_registration = await AppDataSource.getRepository(
          Course
        ).save(course);
        if (!course_registration) {
          return res.status(400).json({ message: "Register Failed" });
        }
        return res.status(200).json({ message: "Register Success" });
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }

  // 교수가 본인 개설 강의 조회
  static async getProfCourses(req: Request, res: Response, next: NextFunction) {
    authenticateProfessor(req, res, async () => {
      try {
        const courses = await AppDataSource.getRepository(Course).find({
          where: {
            professor_id: req.user?.id,
          },
        });

        const simplifiedCourses = courses.map((course) => ({
          course_id: course.id,
          course_name: course.course_name,
          course_number: course.course_number,
        }));

        return res.status(200).json(simplifiedCourses);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }

  // 전체 강의 조회 (학생, 교수 공통, 로그인 필요 X)
  static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await AppDataSource.getRepository(Course).find();
      const simplifiedCourses = courses.map((course) => ({
        course_id: course.id,
        course_name: course.course_name,
        course_number: course.course_number,
      }));
      return res.status(200).json(simplifiedCourses);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  // 학생 본인의 신청강의 조회
  static async getStuCourses(req: Request, res: Response, next: NextFunction) {
    authenticateStudent(req, res, async () => {
      try {
        const courses = await AppDataSource.getRepository(Apply).find({
          where: {
            student_id: req.user?.id,
          },
          relations: ["course"], //relation으로 course관계를 로드
        });

        const applied_courses = courses.map((course) => ({
          course_id: course.course_id,
          course_name: course.course.course_name,
          course_number: course.course.course_number,
        }));

        return res.status(200).json(applied_courses);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }
}
