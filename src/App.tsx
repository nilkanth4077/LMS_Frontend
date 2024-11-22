import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import { ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user_home" element={<UserHome />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
