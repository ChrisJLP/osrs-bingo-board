// frontend/src/hooks/useApi.js
import { useState, useCallback } from "react";
import axios from "axios";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios({ method, url, data, ...config });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "API request failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};

export default useApi;
