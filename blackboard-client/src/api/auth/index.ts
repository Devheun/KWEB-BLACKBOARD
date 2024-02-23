import { SignUpParams, SignInParams } from "../../model/auth";
import ApiManager from "../index";

export const postSignUp = async (signUpInfo: SignUpParams) => {
  const response = await ApiManager.post("/auth/sign-up", signUpInfo);
  return response.data;
};

export const postSignIn = async (signInInfo: SignInParams) => {
  const response = await ApiManager.post("/auth/sign-in", signInInfo);
  console.log(response);
  return response;
};

export const postRefreshToken = async (refreshToken: string) => {
  const response = await ApiManager.post("/auth/refresh-token", refreshToken);
  return response.data;
}

export const postLogout = async () => {
  await ApiManager.post("/auth/logout");
}