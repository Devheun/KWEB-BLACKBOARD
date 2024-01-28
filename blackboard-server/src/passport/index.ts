import passport from "passport";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import bcypty from "bcrypt";
import passportLocal from "passport-local";
import {ExtractJwt, Strategy as JWTStrategy} from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();


const passportConfig = { usernameField: "username", passwordField: "password" };
const LocalStrategy = passportLocal.Strategy;

const JWTConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.secretKey, // JWT 생성할 때 사용한 키와 동일해야함
};


const passportVerify = async (
  username: string,
  password: string,
  done: any
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username: username }); // username이 일치하는 user 찾기
    // 검색된 유저 없을 경우
    if (!user)
      return done(null, false, { reason: "존재하지 않는 사용자입니다." });

    // 검색된 유저가 있을 경우
    bcypty.compare(password, user.password, (err, result) => {
      if (err) return done(null, false, { reason: "로그인에 실패했습니다." });
      if (result) return done(null, username);
      return done(null, false, { reason: "비밀번호가 틀렸습니다." });
    });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

const JWTVerify = async (jwtPayload: any, done: any) => {
  try {
    console.log(jwtPayload);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      username: jwtPayload.username,
    });
    if (user) {
      return done(null, jwtPayload);
    }
    return done(null, false, { reason: "유효하지 않은 인증정보입니다." });
  } catch (err) {
    console.error("JWT Verify Error : ", err.message);
    return done(err);
  }
};

passport.use("local", new LocalStrategy(passportConfig, passportVerify));
passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));
export default passport;
