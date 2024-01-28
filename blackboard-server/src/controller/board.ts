import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Course } from "../entity/Course";
import { User } from "../entity/User";
import { Board } from "../entity/Board";
import { Apply } from "../entity/Apply";
import { authenticateStudent } from "../service/checkIdentity";
import { authenticateProfessor } from "../service/checkIdentity";
import { authenticateIdentity } from "../service/checkIdentity";

export class BoardController {
  // 교수진이 특정 강의에 대한 게시물 등록
  static async register(req: Request, res: Response, next: NextFunction) {
    authenticateProfessor(req, res, async () => {
      try {
        const { course_id, board_title, board_desc } = req.body;

        // 특정 강의 등록한 교수인지 확인
        const checkProf = await AppDataSource.getRepository(Course).findOne({
          where: { id: Number(course_id), professor_id: req.user?.id },
        });
        if (!checkProf) {
          return res
            .status(400)
            .json({ message: "You are not a professor about this course" });
        }

        const boardRepository = AppDataSource.getRepository(Board);
        const board = new Board();
        board.course_id = Number(course_id);
        board.board_title = board_title;
        board.board_desc = board_desc;
        const board_registration = await boardRepository.save(board);
        if (!board_registration) {
          return res.status(400).json({ message: "Register Failed" });
        }
        return res.status(200).json({ message: "Register Success" });
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }

  // 수강하고 있는 모든 강의들의 전체 게시물 돌려주기 (created_at 기준 내림차순)
  static async getAllBoards(req: Request, res: Response, next: NextFunction) {
    authenticateStudent(req, res, async () => {
      try {
        const applyRepository = AppDataSource.getRepository(Apply);
        const applies = await applyRepository.find({
          where: { student_id: req.user?.id },
          relations: ["course", "course.boards"],
        });

        const result = applies
          .flatMap((apply) =>
            apply.course.boards.map((board) => ({
              course_name: apply.course.course_name,
              board_title: board.board_title,
              board_desc: board.board_desc,
              createdAt: board.createdAt,
            }))
          )
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // createAt 내림차순으로 정렬

        return res.status(200).json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }

  // 특정 강의에 대한 전체 게시물 돌려주기 (학생, 교수 상관 X), 본인이 듣거나 가르치는 수업에 한해서
  static async getBoardsByCourseId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    authenticateIdentity(req, res, async () => {
      try {
        const { course_id } = req.params;
        // 본인이 수강중인 강의 or 본인이 가르치는 강의인지 확인
        const applyRepository = AppDataSource.getRepository(Apply);
        const checkStudent = await applyRepository.findOne({
          where: { student_id: req.user?.id, course_id: Number(course_id) },
        });

        const checkProf = await AppDataSource.getRepository(Course).findOne({
          where: { id: Number(course_id), professor_id: req.user?.id },
        });

        if (!checkProf && !checkStudent) {
          return res
            .status(400)
            .json({ message: "You are not related to this course" });
        }

        const boardRepository = AppDataSource.getRepository(Board);
        const boards = await boardRepository.find({
          where: { course_id: Number(course_id) },
        });

        const simplifiedBoards = boards.map((board) => ({
          board_title: board.board_title,
          board_desc: board.board_desc,
        }));

        return res.status(200).json(simplifiedBoards);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }

  // 특정 게시물 돌려주기 (학생, 교수 상관 X), 본인이 듣거나 가르치는 수업에 한해서
  static async getBoardByBoardId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    authenticateIdentity(req, res, async () => {
      try {
        const { board_id } = req.params;

        const boardRepository = AppDataSource.getRepository(Board);
        const board = await boardRepository.findOne({
          where: { id: Number(board_id) },
        });

        if (!board) {
          return res.status(400).json({ message: "Board does not exist" });
        }

        // 본인이 수강하는 강의인지 확인
        const checkStudent = await AppDataSource.getRepository(Apply).findOne({
          where: { student_id: req.user?.id, course_id: board.course_id },
        });

        // 본인이 가르치는 강의인지 확인
        const checkProf = await AppDataSource.getRepository(Course).findOne({
          where: { id: board.course_id, professor_id: req.user?.id },
        });

        if (!checkProf && !checkStudent) {
          return res
            .status(400)
            .json({ message: "You are not related to this course" });
        }

        const simplifiedBoard = {
          board_title: board.board_title,
          board_desc: board.board_desc,
        };

        return res.status(200).json(simplifiedBoard);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  }
}
