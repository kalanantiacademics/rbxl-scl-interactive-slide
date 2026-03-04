import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Day1 from "./materials/Day1.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/rbxl-scl-interactive-slide">
      <Routes>
        <Route path="" element={<App />} />
        <Route path="/lesson/RBXL_1" element={<Day1 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);