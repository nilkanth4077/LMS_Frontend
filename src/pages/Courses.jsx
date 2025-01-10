import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, SetEnrolled] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const allCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/public/courses/all",
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          console.log("Courses: ", data);
        } else {
          setCourses(null);
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (userId) {
      fetch(`http://localhost:8081/user/learning/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push(data[i].course_id);
          }
          SetEnrolled(arr);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }

    allCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!token) {
      toast.error("Please log in to enroll.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/user/course/enroll",
        {
          courseId: courseId,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Enrollment successful!");
        console.log("Token: ", token);
        navigate(`/course/${courseId}`);
      }
    } catch (error) {
      console.error(error);
      console.log("Token: ", token);
      toast.error("Failed to enroll. Please try again.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
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

              {enrolled.includes(course.course_id) ? (
                <button
                  onClick={() => navigate("/learnings")}
                  className="inline-flex items-center px-5 py-4 text-lg font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 my-4"
                >
                  Enrolled
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(course.course_id)}
                  className="inline-flex items-center px-5 py-4 text-lg font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 my-4"
                >
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
