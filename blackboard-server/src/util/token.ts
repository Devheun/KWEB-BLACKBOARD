// token.ts
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { RefreshToken } from "../entity/Token";
import { User } from "../entity/User";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();


export const createAccessToken = (object : Object) =>{
  const accessToken = jwt.sign(object, process.env.secretKey, { expiresIn: "1m" });
  return accessToken;
}

// Refresh Token 생성해주기
export const createRefreshToken = async (user: User): Promise<string> => {

  const existingToken = await AppDataSource.getRepository(RefreshToken).findOne({
    where: { userId: user.id },
  });

  if (existingToken) {
    return existingToken.token;
  }

  const refreshToken = jwt.sign({}, process.env.refreshKey, { expiresIn: "14d" });
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
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where : {id : decoded.userId}
    });
    return !!user; // user가 존재하면 true, 존재하지 않으면 false
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return false;
  }
};


// Access Token 재발급
// header에 token 보내는 식 (client가 보낸 refresh token 검증 후 access token 재발급)
export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
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

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          isProfessor: user.isProfessor,
        },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
      console.log("New Access Token:", newAccessToken);
      return newAccessToken;
    } else {
      console.log("Refresh token is not valid");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};
