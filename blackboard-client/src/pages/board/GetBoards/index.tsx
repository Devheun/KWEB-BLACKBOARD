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
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getBoardList } from "../../../api/board";


const AppliedBoardPage: React.FC = () => {
    const [boardData, setBoardData] = useState<any[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const { course_id } = useParams();

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

  const handleSignOut = () => {
    signOut();
    setLoggedInUser(null);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBoardList(Number(course_id));
        setBoardData(result);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("에러 발생:", error.response?.data ?? error.message);
        } else {
          console.error("에러 발생:", error);
        }
      }
    };

    fetchData();
  }, [course_id]);

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
            <h2>게시물 목록</h2>
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
              <TableCell style={{ fontWeight: "bold" }}>게시글 제목</TableCell>
              <TableCell align="right" style={{ fontWeight: "bold" }}>
                게시물 내용
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boardData.map((board,index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                    {board.board_title}
                </TableCell>
                <TableCell align="right" >{board.board_desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AppliedBoardPage;
