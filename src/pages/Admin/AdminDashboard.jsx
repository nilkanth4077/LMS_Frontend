import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
// import AddCourse from "../../pages/AddCourse";
// import AddTutor from "../../pages/Admin/AddTutor";
import AdminSideBar from "../../pages/Admin/AdminSideBar";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <div className="mt-12">
        <AdminSideBar />
      </div>
      <Footer />
    </>
  );
};
