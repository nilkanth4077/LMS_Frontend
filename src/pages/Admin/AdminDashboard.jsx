import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AddCourse from "../../pages/Admin/AddCourse";
import AddTutor from "../../pages/Admin/AddTutor";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <div className="mt-12">
        <AddCourse />
        <AddTutor />
      </div>
      <Footer />
    </>
  );
};
