import { AddCourseParams } from "../../model/course";
import ApiManager from "../index";

export const postAddCourse = async (courseInfo: AddCourseParams) => {
    try {
        const response = await ApiManager.post("/course", courseInfo);
        console.log(response);
      } catch (error) {
        console.error("Error during postAddCourse:", error);
      }
      
  };

export const getProfCourses = async () => {
  try{
    const response = await ApiManager.get("/course/professor");
    return response.data;
  }catch(error){
    console.error("Error during getProfCourses:", error);
  }
}

export const getCourses = async () => {
  try{
    const response = await ApiManager.get("/course");
    return response.data;
  }catch(error){
    console.error("Error during getCourses:", error);
  }

}

export const getStuCourses = async () => {
  try{
    const response = await ApiManager.get("/course/student");
    return response.data;
  }catch(error){
    console.error("Error during getStuCourses:", error);
  }
}