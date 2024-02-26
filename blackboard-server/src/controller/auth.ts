import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { createAccessToken, createRefreshToken } from "../util/token";

dotenv.config();

export class UserController {
  static async sign_up(req: Request, res: Response) {
    // 전역화 지역 메서드 static, static 입장에서 class는 '소속'개념
    try {
      const { username, password, studentNumber, name, isProfessor } = req.body;
      const bcryptPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.username = username;
      user.password = bcryptPassword;
      user.studentNumber = studentNumber;
      user.name = name;
      user.isProfessor = isProfessor;

      const userRepository = AppDataSource.getRepository(User);
      await userRepository.save(user);

      return res.status(200).json({ message: "Register Success" });
    } catch (error) {
      // 중복된 키 삽입이 시도되었을 때의 에러 처리
      if (
        error.code === "ER_DUP_ENTRY" ||
        error.detail?.includes("already exists")
      ) {
        res.status(400).json({ message: "이미 존재하는 사용자입니다." });
      } else {
        // 다른 종류의 에러 처리
        console.error(error);
        res.status(500).json({ message: "서버 오류" });
      }
    }
  }

  static async sign_in(req: Request, res: Response, next: any) {
    passport.authenticate(
      "local",
      async (passportError: Error, user: string) => {
        try {
          if (passportError || !user) {
            return res.status(400).json({ message: "error" });
          }

          const userRepository = AppDataSource.getRepository(User);
          const authenticatedUser = await userRepository.findOne({
            where: { username: user },
          });

          if (!authenticatedUser) {
            return res
              .status(400)
              .json({ message: "존재하지 않는 사용자입니다." });
          }

          req.login(authenticatedUser, { session: false }, async (loginError) => {
            if (loginError) return res.send(loginError);

            const payload = {
              id: authenticatedUser.id,
              username: authenticatedUser.username,
              isProfessor: authenticatedUser.isProfessor,
            };

            // access token 생성
            const token = createAccessToken(payload);
            // refresh token 생성 (DB에도 저장)
            const refreshToken = await createRefreshToken(authenticatedUser);

            const { name, studentNumber, isProfessor } = authenticatedUser;
            res.cookie('refreshToken', refreshToken);
            return res.json({
              token,
              name,
              studentNumber,
              isProfessor,
            });
          });
        } catch (err) {
          console.error(err);
          next(err);
        }
      }
    )(req, res, next);
  }

  static async logout(req : Request, res: Response) {
    res.clearCookie('refreshToken');
    res.status(200).json({message: "로그아웃 성공"});
  }
}
