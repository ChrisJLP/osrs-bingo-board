import { useEffect, useState } from "react";
import axios from "axios";

function TestComponent() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5001")
      .then((res) => setMessage(res.data))
      .catch((err) => setMessage("Error: " + err));
  }, []);

  return <h1 className="text-2xl font-bold text-blue-500">{message}</h1>;
}

export default TestComponent;
