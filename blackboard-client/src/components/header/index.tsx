import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { postLogout } from "../../api/auth";

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const storedUser = localStorage.getItem("_auth_state");
  const isAuth = useAuthUser()();
  useEffect(() => {
    if (!isAuth) {
      setLoggedInUser(null);
    } else {
      const authState = isAuth;
      const name = authState && authState.name;
      setLoggedInUser(name);
    }
    console.log("loggedInUser 상태값:", loggedInUser);
  }, [isAuth]);
  

  const navigate = useNavigate();
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await postLogout();
    setLoggedInUser(null);
    navigate("/");
    signOut();
  };

  const checkIsProfessor = storedUser && JSON.parse(storedUser).isProfessor;

  return (
    <AppBar component="nav" color="transparent">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          //   onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          {/* <MenuIcon /> */}
        </IconButton>
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
          {loggedInUser ? (
            <>
              {checkIsProfessor && <Link to={"/board/add"}>강의 게시물 작성</Link>}
              {checkIsProfessor && <Link to={"/course"}>강의 관리</Link>}
              {!checkIsProfessor && <Link to={"/apply"}>수강 신청</Link>}
              {!checkIsProfessor && <Link to={"/course/student"}>수강 강의 목록</Link>}
              {!checkIsProfessor && <Link to={"/board"}>게시물 목록</Link>}
            </>
          ) : (
            <></>
          )}
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
            textAlign: "center",
          }}
        >
          {loggedInUser ? (
            <></>
          ) : (
            <>
              <Link to={"/auth/sign-in"}>로그인&nbsp;</Link>
              <Link to={"/auth/sign-up"}>&nbsp;회원가입</Link>
            </>
          )}
        </Typography>
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
  );
};

export default Header;
