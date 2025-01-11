import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AddCourse from "../../pages/AddCourse";

export default function TutorDashboard() {
  return (
    <>
      <Navbar />
      <div className="mt-12">
        <h1>Tutor Dashboard</h1>
        <AddCourse />
      </div>
      <Footer />
    </>
  );
};
