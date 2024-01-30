// token.ts
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { RefreshToken } from "../entity/Token";
import { User } from "../entity/User";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();


export const createAccessToken = (object : Object) =>{
  const accessToken = jwt.sign(object, process.env.secretKey, { expiresIn: "1h" });
  return accessToken;
}

// Refresh Token 생성해주기
export const createRefreshToken = async (user: User): Promise<string> => {
  const refreshToken = jwt.sign({}, process.env.refreshKey, { expiresIn: "14d" });
  console.log(refreshToken);
  const refreshTokenEntity = new RefreshToken();
  refreshTokenEntity.userId = user.id;
  refreshTokenEntity.token = refreshToken;
  refreshTokenEntity.expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
  await refreshTokenRepository.save(refreshTokenEntity);

  return refreshToken;
};


// Refresh Token 검증
export const verifyRefreshToken = async (token: string): Promise<boolean> => {
  try {
    const decoded = jwt.verify(token, process.env.refreshKey);
    if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
      const existingToken = await refreshTokenRepository.findOne({
        where: { token },
      });

      if (existingToken && existingToken.expiryDate > new Date()) { // 만료되었는지 체크
        return true;
      }
    }
  } catch (error) {
    console.error("Error verifying refresh token:", error);
  }

  return false;
};


// Access Token 재발급
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  const isTokenValid = await verifyRefreshToken(refreshToken);

  if (isTokenValid) {

    const decoded = jwt.verify(refreshToken, process.env.refreshKey) as { userId: number };
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          isProfessor: user.isProfessor,
        },
        process.env.secretKey,
        { expiresIn: "1h" }
      );

    return res.json({ accessToken: newAccessToken });
  } else {
    return res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};
