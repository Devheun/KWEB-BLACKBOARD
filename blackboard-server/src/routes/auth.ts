import * as express from "express";
import { UserController } from "../controller/auth";
import { Request, Response } from "express";
import { refreshAccessToken } from "../util/token";
import jwt from "jsonwebtoken";


const router = express.Router();


router.post("/sign-up", UserController.sign_up);
router.post("/sign-in", UserController.sign_in);

// refresh token 검증 후 새로운 access token 발급
router.post("/refresh", async (req:Request, res:Response)=>{

    const accessToken = req.header("Authorization")?.replace("Bearer ", "");
    const {refreshToken} = req.body;

    if (!refreshToken || !accessToken){
        return res.status(400).json({message:"refresh token not found"});
    }

    // access token 검증 -> expired여야 refresh 가능
    try{
        const accessResult = jwt.verify(accessToken, process.env.secretKey);
    }catch(error){
        if(error.name === "TokenExpiredError"){ // 액세스 토큰이 만료되었을 때
            try{
                const refreshResult = jwt.verify(refreshToken, process.env.refreshKey);
            }catch(error){
                if(error.name==="TokenExpiredError"){ // refresh token이 만료되었을 때 -> 로그인 다시 해야함
                    return res.status(401).json({message:"Unauthorized"});
                }else{ // access token이 만료되고, refresh token이 만료되지 않았을 때 -> 새로운 access token 발급
                    const newAccessToken = await refreshAccessToken(refreshToken);
                    return res.json({newAccessToken,refreshToken});
                }
            }
        }else{ // 액세스 토큰이 만료되지 않은 경우
            return res.status(400).json({
                message:"Access Token is not expired"
            })
        }
    }
})

export {router as authRouter};