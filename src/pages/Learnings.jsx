import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Learnings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const token = localStorage.getItem("token");
  const [courses, setCourse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(
          `http://localhost:8081/user/learning/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCourse();
  }, []);

  if (courses.length === 0) {
    return (
      <>
        <Header page="learnings" />
        <div className="mt-28 text-center">
          <h1 style={{ fontSize: "30px", marginBottom: "20px" }}>
            You have not enrolled in any courses yet...!!!
          </h1>
          <p style={{ color: "#666", fontSize: "18px" }}>
            Explore our courses and start your learning journey.
          </p>
          <button
            className="inline-flex items-center px-5 py-4 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4"
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header page={"learnings"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 mb-6">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <a href="#">
              <img
                className="rounded-t-lg w-full h-48 object-cover"
                src={course.p_link}
                alt=""
              />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {course.course_name}
                </h5>
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  by {course.instructor}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 h-16 overflow-hidden">
                {course.description}
              </p>

              <p className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Price: {course.price}
              </p>
              <button
                onClick={() => navigate(`/course/${course.course_id}`)}
                className="inline-flex items-center px-5 py-4 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4"
              >
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
export default Learnings;
