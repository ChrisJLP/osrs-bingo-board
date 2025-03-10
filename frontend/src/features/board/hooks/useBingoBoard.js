// frontend/src/features/board/hooks/useBingoBoard.js
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const useBingoBoard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [boardData, setBoardData] = useState(null);

  const fetchBoard = async (name) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/solo-board/${name}`);
      setBoardData(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch board");
      setLoading(false);
      return null;
    }
  };

  const saveBoard = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/solo-board`, data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save board");
      setLoading(false);
      return null;
    }
  };

  const updateBoard = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.put(`${API_URL}/solo-board/${data.name}`, data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update board");
      setLoading(false);
      return null;
    }
  };

  return { boardData, loading, error, fetchBoard, saveBoard, updateBoard };
};
