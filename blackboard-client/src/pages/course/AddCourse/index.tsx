import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { AddCourseParams } from "../../../model/course";
import { AxiosError } from "axios";
import { postAddCourse } from "../../../api/course";

const AddCoursePage: React.FC = () => {
  const [addCourseData, setAddCourseData] = useState<AddCourseParams>({
    course_name: "",
    course_number: "",
  });
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("_auth_state");
    if (storedUser) {
      const authState = JSON.parse(storedUser);
      const name = authState && authState.name;
      setLoggedInUser(name);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddCourseData({
      ...addCourseData,
      [name]: value,
    });
  };

  const handleAddCourse = async () => {
    try{
        await postAddCourse(addCourseData);
        alert("강의 등록 완료!")
        navigate("/course");
    }catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          alert(error.response?.data.message ?? "서버에서 에러 발생");
          return;
        }
        alert("알 수 없는 에러 발생");
      }
  }

  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    setLoggedInUser(null);
    navigate("/");
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // 페이지의 높이를 100%로 설정
      }}
    >
      <AppBar component="nav" color="transparent">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          ></IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
            }}
          >
            <h3>
              <span onClick={()=>navigate("/")}>BLACKBOARD</span>
            </h3>
          </Typography>
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <h2>강의 등록</h2>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              position: "absolute",
              right: 0,
            }}
          >
            {loggedInUser && `안녕하세요! ${loggedInUser}님`}
            {loggedInUser && <Button onClick={handleSignOut}>로그아웃</Button>}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          name="course_name"
          label="강의 이름"
          variant="outlined"
          margin="normal"
          value={addCourseData.course_name}
          onChange={handleChange}
          sx={{ width: "100%", marginBottom: 2 }}
        />
        <TextField
          name="course_number"
          label="강의 번호"
          variant="outlined"
          margin="normal"
          value={addCourseData.course_number}
          onChange={handleChange}
          sx={{ width: "100%", marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" sx={{ width: "100%" }} onClick={handleAddCourse}>
          강의 등록
        </Button>
      </Box>
    </Container>
  );
};

export default AddCoursePage;
