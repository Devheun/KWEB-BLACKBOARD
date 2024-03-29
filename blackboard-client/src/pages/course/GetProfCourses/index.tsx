import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { getProfCourses } from "../../../api/course";
import { Link } from "react-router-dom";
import { postLogout } from "../../../api/auth";

const GetProfCoursePage: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [professorCourses, setProfessorCourses] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("_auth_state");
    if (storedUser) {
      const authState = JSON.parse(storedUser);
      const name = authState && authState.name;
      setLoggedInUser(name);
    }
  }, []);

  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await postLogout();
    signOut();
    setLoggedInUser(null);
    navigate("/");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProfCourses();
        setProfessorCourses(result);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("에러 발생:", error.response?.data ?? error.message);
        } else {
          console.error("에러 발생:", error);
        }
      }
    };

    fetchData();
  }, []);

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
            <h2>내 강의 조회</h2>
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>학수번호</TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                과목
              </TableCell>
              <TableCell align="left" style={{ fontWeight: "bold" }}>
                게시물 목록
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professorCourses.map((course) => (
              <TableRow
                key={course.course_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {course.course_number}
                </TableCell>
                <TableCell align="right">
                  <Link to={`/apply/${course.course_id}`}>
                    {course.course_name}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <Link to={`/board/${course.course_id}`}>
                    게시물 조회
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default GetProfCoursePage;
