import ApiManager from "../index";

export const getStudents = async (course_id : number) => {
    try{
      const response = await ApiManager.get(`/apply/${course_id}`);
      return response.data;
    }catch(error){
      console.error("Error during getStudents:", error);
    }
  }

export const deleteStudents = async (student_id : number, course_id : number)=>{
    try{
        const response = await ApiManager.delete(`/apply/${student_id}`,{
            data : {course_id}
        });
        return response.data;
    }catch(error){
        console.error("Error during deleteStudents:", error);
    }
}

export const apply = async (course_id : number) =>{
  try{
    const response = await ApiManager.post(`/apply/${course_id}`);
    return response.data;
}catch(error){
    console.error("Error during apply:", error);
}
}