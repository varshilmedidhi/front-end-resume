import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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
