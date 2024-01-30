import * as express from "express";
import { UserController } from "../controller/auth";
import { Request, Response } from "express";
import { refreshAccessToken } from "../util/token";


const router = express.Router();


router.post("/sign-up", UserController.sign_up); // POST, PUT, DELETE, GET
router.post("/sign-in", UserController.sign_in);
// refresh token 검증 후 새로운 access token 발급
router.post("/refresh-token", async (req:Request, res:Response)=>{
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken){
        return res.status(400).json({message:"refresh token not found"});
    }
    const newAccessToken = await refreshAccessToken(refreshToken);
    if(newAccessToken){
        return res.json({accessToken : newAccessToken});
    } else{
        return res.status(401).json({message:"Invalid or expired refresh token"});
    }
})

export {router as authRouter};