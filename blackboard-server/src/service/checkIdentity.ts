import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";

export const authenticateProfessor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.secretKey) as { id: number };
    console.log(decoded);
    const userRepository = AppDataSource.getRepository(User);
    const checkProf = await userRepository.findOne({
      where: { isProfessor: true, id: decoded.id },
    });

    if (!checkProf) {
      return res.status(400).json({ message: "You are not a professor" });
    }

    req.user = { id: decoded.id }; // 프론트엔드에서 사용자 정보를 활용하려면 req.user에 저장
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authenticateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.secretKey) as { id: number };
    const userRepository = AppDataSource.getRepository(User);
    const checkStu = await userRepository.findOne({
      where: { isProfessor: false, id: decoded.id },
    });

    if (!checkStu) {
      return res.status(400).json({ message: "You are not a student" });
    }

    req.user = { id: decoded.id }; // 프론트엔드에서 사용자 정보를 활용하려면 req.user에 저장
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authenticateIdentity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.secretKey) as { id: number };
    const userRepository = AppDataSource.getRepository(User);
    const checkIdentity = await userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!checkIdentity) {
      return res.status(400).json({ message: "You are not a student" });
    }

    req.user = { id: decoded.id }; // 프론트엔드에서 사용자 정보를 활용하려면 req.user에 저장
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
