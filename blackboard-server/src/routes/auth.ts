import * as express from "express";
import { UserController } from "../controller/auth";
import { Request, Response } from "express";
import { refreshAccessToken } from "../util/token";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { access } from "fs";
dotenv.config();

const router = express.Router();

router.post("/sign-up", UserController.sign_up);
router.post("/sign-in", UserController.sign_in);

// refresh token 검증 후 새로운 access token 발급
// ...

// refresh token 검증 후 새로운 access token 발급
router.post("/refresh", async (req: Request, res: Response) => {
  const accessToken = req.header("Authorization")?.replace("Bearer ", "");
  const { refreshToken } = req.body;

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  if (!refreshToken || !accessToken) {
    return res.status(400).json({ message: "refresh token not found" });
  }

  // access token 검증 -> expired 여야 refresh 가능
  try {
    const accessResult = jwt.verify(accessToken, process.env.secretKey);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const refreshResult = jwt.verify(refreshToken, process.env.refreshKey);
        // refresh token이 만료되지 않았을 때
        const newAccessToken = await refreshAccessToken(refreshToken);
        return res.json({ newAccessToken, refreshToken });
      } catch (error) {
        // refresh token이 만료되었을 때
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          console.error("Error verifying refresh token:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }
    } else {
      // 액세스 토큰이 만료되지 않은 경우
      return res.status(400).json({ message: "Access Token is not expired" });
    }
  }
});

export { router as authRouter };
