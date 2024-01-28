import { AddBoardParams } from "../../model/board";
import ApiManager from "../index";

export const postAddBoard = async (boardInfo: AddBoardParams) => {
  const response = await ApiManager.post("/board", boardInfo);
  return response.data;
};

export const getBoardList = async (course_id : number) => {
  const response = await ApiManager.get(`/board/${course_id}`);
  return response.data;
}

export const getAllBoards = async()=>{
  const response = await ApiManager.get("/board");
  return response.data;
}