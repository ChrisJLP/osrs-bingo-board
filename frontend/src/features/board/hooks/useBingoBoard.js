// frontend/src/features/board/hooks/useBingoBoard.js
import { useState } from "react";
import useApi from "../../../hooks/useApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const useBingoBoard = () => {
  const { loading, error, request } = useApi();
  const [boardData, setBoardData] = useState(null);

  const fetchBoard = async (name) => {
    const data = await request("get", `${API_URL}/solo-board/${name}`);
    if (data) {
      setBoardData(data);
    }
    return data;
  };

  const saveBoard = async (data) => {
    return await request("post", `${API_URL}/solo-board`, data);
  };

  const updateBoard = async (data) => {
    return await request("put", `${API_URL}/solo-board/${data.name}`, data);
  };

  return { boardData, loading, error, fetchBoard, saveBoard, updateBoard };
};
