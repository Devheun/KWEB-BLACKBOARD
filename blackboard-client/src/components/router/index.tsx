import { Route, Routes } from "react-router-dom";
import MainPage from "../../pages/main";
import SignInPage from "../../pages/auth/SignIn";
import SignUpPage from "../../pages/auth/SignUp";
import CoursePage from "../../pages/course";
import AddCoursePage from "../../pages/course/AddCourse";
import GetProfCoursePage from "../../pages/course/GetProfCourses";
import AddBoardPage from "../../pages/board/AddBoard";
import GetProfApplyPage from "../../pages/apply/GetStudents";
import ApplyPage from "../../pages/apply/Register";
import GetStuCoursePage from "../../pages/course/GetStuCourses";
import AppliedBoardPage from "../../pages/board/GetBoards";
import AllBoardPage from "../../pages/board/GetAllBoards";

const RouteComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/course" element={<CoursePage />} />
      <Route path="/course/add" element={<AddCoursePage />} />
      <Route path="/course/professor" element={<GetProfCoursePage />} />
      <Route path="/board/add" element={<AddBoardPage />} />
      <Route path="/apply/:course_id" element={<GetProfApplyPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/course/student" element={<GetStuCoursePage />} />
      <Route path="/board/:course_id" element={<AppliedBoardPage />} />
      <Route path="/board" element={<AllBoardPage/>} />
    </Routes>
  );
};

export default RouteComponent;
