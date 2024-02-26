import { Box, Button, TextField, Typography } from "@mui/material";
import { SignUpParams } from "../../../model/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { postSignUp } from "../../../api/auth";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const SignUpPage: React.FC = () => {
  const [signUpData, setSignUpData] = useState<SignUpParams>({
    username: "",
    password: "",
    name: "",
    studentNumber: null,
    isProfessor: false,
  });
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleChangeProf = (event: SelectChangeEvent) => {
    setSignUpData({
        ...signUpData,
        isProfessor: event.target.value === "true"
    });
  };

  const handleSignUp = async () => {
    try {
      await postSignUp(signUpData);
      navigate("/auth/sign-in");
    } catch (error) {
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
      <Typography variant="h2">회원가입 페이지</Typography>
      <TextField
        name="username"
        value={signUpData.username}
        label="아이디"
        onChange={handleChange}
        placeholder="leesiheun@korea.ac.kr"
      />
      <TextField
        name="password"
        value={signUpData.password}
        label="비밀번호"
        onChange={handleChange}
        placeholder="string"
        type="password"
      />
      <TextField
        name="name"
        value={signUpData.name}
        label="이름"
        onChange={handleChange}
        placeholder="이시흔"
      />
      <TextField
        name="studentNumber"
        value={signUpData.studentNumber ?? ""}
        label="학번"
        onChange={handleChange}
        placeholder="2020320098"
      />
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">교수 여부</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={signUpData.isProfessor ? "true" : "false"} // select value는 string 이나 number만 가능
          label="교수 여부"
          onChange={handleChangeProf}
        >
          <MenuItem value="false">학생</MenuItem>
          <MenuItem value="true">교수</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleSignUp}>회원가입</Button>
    </Box>
  );
};

export default SignUpPage;
