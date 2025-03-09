import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// You can also create an axios instance here if you want
import axios from "axios";
import { BASE_URL } from "./config";

// Create axios instance with default config
axios.defaults.baseURL = BASE_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} /> : <Login setToken={setToken} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
