import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SignInParams } from "../../../model/auth";
import { postSignIn } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useSignIn } from "react-auth-kit";

const SignInPage: React.FC = () => {
  const [signInData, setSignInData] = useState<SignInParams>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const signIn = useSignIn();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInData({
      ...signInData,
      [name]: value,
    });
  };

  const handleSignIn = async () => {
    try {
      const res = await postSignIn(signInData);
      const authData = {
        token: res.data.token,
        tokenType: "Bearer",
        authState: {
          studentNumber: res.data.studentNumber,
          name: res.data.name,
          isProfessor: res.data.isProfessor,
        },
        expiresIn: 60 * 60 * 24 * 1000,
      };
      signIn(authData);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message ?? "서버에서 에러 발생");
        return;
      }
      alert("알 수 없는 에러 발생");
    }
  };

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2">로그인 페이지</Typography>
      <TextField
        name="username"
        value={signInData.username}
        label="아이디"
        onChange={handleChange}
        placeholder="leesiheun@korea.ac.kr"
      />
      <TextField
        name="password"
        value={signInData.password}
        label="비밀번호"
        onChange={handleChange}
        placeholder="string"
        type="password"
      />
      <Button onClick={handleSignIn}>로그인</Button>
    </Box>
  );
};

export default SignInPage;
