import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Course } from "../entity/Course";
import { Apply } from "../entity/Apply";
import { authenticateStudent } from "../service/checkIdentity";
import { authenticateProfessor } from "../service/checkIdentity";

export class ApplyController {
  // 학생이 특정 강의에 대해 수강신청
  static async apply(req: Request, res: Response, next: NextFunction) {
    authenticateStudent(req, res, async () => {
      try {
        const { course_id } = req.params;
        const applyRepository = AppDataSource.getRepository(Apply);
        const apply = new Apply();
        apply.student_id = req.user?.id;
        apply.course_id = Number(course_id);
        await applyRepository.save(apply);
        return res.status(200).json({ message: "Register Success" });
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }

  // 교수진이 특정 강의 수강하고 있는 학생 목록 조회
  static async getStudents(req: Request, res: Response, next: NextFunction) {
    authenticateProfessor(req, res, async () => {
      try {
        const { course_id } = req.params;

        // 특정 강의 등록한 교수인지 확인
        const checkProf = await AppDataSource.getRepository(Course).findOne({
          where: { id: Number(course_id), professor_id: req.user?.id },
        });

        if (!checkProf) {
          return res
            .status(400)
            .json({ message: "You are not a professor about this course" });
        }

        // 특정 강의 수강하고있는 학생 목록 조회
        const applyRepository = AppDataSource.getRepository(Apply);
        const students = await applyRepository.find({
          where: { course_id: Number(course_id) },
          relations: {
            user: true,
          },
        });

        const students2 = students.map((student, index) => {
          return {
            id: index + 1,
            name: student.user.name,
            student_number: student.user.studentNumber,
            student_id : student.user.id
          };
        });

        return res.status(200).json(students2);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }
  // 교수진이 특정 강의 수강하고 있는 학생 수강 취소
  static async deleteApply(req: Request, res: Response, next: NextFunction) {
    authenticateProfessor(req, res, async () => {
      try {
        // body에 course_id 존재하는지 확인
        const { course_id } = req.body;
        console.log(course_id);
        if (!course_id) {
          return res.status(400).json({ message: "course_id is required" });
        }

        // 특정 강의 등록한 교수인지 확인
        const checkProf = await AppDataSource.getRepository(Course).findOne({
          where: { id: Number(course_id), professor_id: req.user?.id },
        });

        if (!checkProf) {
          return res
            .status(400)
            .json({ message: "You are not a professor about this course" });
        }

        // 수강신청 취소
        const applyRepository = AppDataSource.getRepository(Apply);
        const { student_id } = req.params;
        const softDeletedUser = await applyRepository.softDelete({
          student_id: Number(student_id),
          course_id: Number(course_id),
        });

        if (!softDeletedUser.affected) {
          return res.status(400).json({ message: "수강 취소에 실패했습니다." });
        } else {
          return res.status(200).json({ message: "수강 취소에 성공했습니다." });
        }
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }
}
