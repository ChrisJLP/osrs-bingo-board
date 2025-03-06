import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const saveSoloBoard = async (boardData) => {
  const response = await axios.post(`${API_URL}/solo-board`, boardData);
  return response.data;
};

export const updateSoloBoard = async (boardData) => {
  const res = await axios.put(`/solo-board/${boardData.name}`, boardData);
  return res.data;
};
