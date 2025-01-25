import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Learnings from "./pages/Learnings";
import UserHome from "./pages/UserHome";
import Courses from "./pages/Courses";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Course from "./pages/Course";
import Discussion from "./pages/Discussion";
import Assessment from "./pages/Assessment";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Students from "./pages/Admin/Students";
import TutorDashboard from "./pages/Tutor/TutorDashboard";
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
        <Route path="/courses" element={<Courses />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/tutor_dashboard" element={<TutorDashboard />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/users" element={<Students />} />
        <Route path="/learnings" Component={Learnings} />
        <Route path="/discussion/:id" Component={Discussion} />
        <Route path="/assessment/:id" Component={Assessment} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
