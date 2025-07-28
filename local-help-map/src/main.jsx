import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login"; // adjust path if needed
import LandingPage from "./pages/LandingPage"; // adjust path if needed
import SecondLandingPage from "./pages/SecondLandingPage"; // adjust path if needed

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/landing2" element={<LandingPage />} />
      <Route path="/" element={<SecondLandingPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
