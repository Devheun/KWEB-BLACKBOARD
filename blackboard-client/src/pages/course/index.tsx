import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tab,
  Tabs,
  Container,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate, Link } from "react-router-dom";


const CoursePage: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("_auth_state");
    if (storedUser) {
      const authState = JSON.parse(storedUser);
      const name = authState && authState.name;
      setLoggedInUser(name);
    }
  }, []);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
            // onClick={handleDrawerToggle}
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
            <h2>강의 관리 페이지</h2>
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
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="강의 등록" component={Link} to="/course/add"/>
          <Tab label="내 강의 조회" component={Link} to="/course/professor"/>
        </Tabs>
      </AppBar>
    </Container>
  );
};

export default CoursePage;
