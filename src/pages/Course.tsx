import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Forum from "./forum";
import ReactPlayer from "react-player";
import { Progress } from "antd";
import { Button, Modal } from "antd";
import Feedback from "./Feedback";
import Header from "../components/Navbar";
import Footer from "../components/Footer";

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [course, setCourse] = useState({
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(null);
  const [played, setPlayed] = useState(0);
  const [changePlayed, setChangePlayed] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;
  const [popup, setPopup] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedCourse = response.data;
        setCourse(fetchedCourse);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleDuration = () => {
    setDuration(playerRef.current.getDuration());
    if (duration !== 0) {
      fetch("http://localhost:8080/user/progress/update-duration", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId,
          duration,
        }),
      });
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8080/user/progress/${userId}/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPlayed(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const updateProgress = async () => {
      if (courseId && userId) {
        try {
          const response = await fetch(
            "http://localhost:8080/user/progress/update-progress",
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                courseId,
                playedTime: played,
                duration,
              }),
            }
          );

          if (response.ok) {
            setPlayed(changePlayed < played ? played : changePlayed);
          } else {
            console.error("Error updating progress:", response.statusText);
          }
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }
    };

    updateProgress();
  }, [changePlayed]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    navigate("/login");
    return (
      <div className="text-center text-lg text-red-600">
        Something went wrong!
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h3 className="text-center text-white py-4 text-lg italic font-bold bg-blue-900 mt-14">
        The Complete {course.course_name} Course - 2023
      </h3>
      <div className="flex flex-col items-center justify-center px-8 py-6">
        <div className="flex flex-wrap w-full gap-6">
          <ReactPlayer
            ref={playerRef}
            onProgress={(Progress) => {
              if (changePlayed + 10 <= Progress.playedSeconds) {
                setChangePlayed(Progress.playedSeconds);
              }
            }}
            url={course.y_link}
            controls
            type="video/mp4"
            width="100%" // Full width
            height="500px" // Adjust height as needed
            onDuration={handleDuration}
            played={played}
            className="shadow-lg rounded-md bg-gray-600"
          />

          <div className="border grid grid-cols-1 md:grid-cols-2 gap-8 w-full shadow-lg rounded-md bg-white p-6">
            {/* Left Column */}
            <div>
              <h4 className="text-xl font-semibold">Course Format:</h4>
              <p className="text-gray-700 mt-2">
                This is a self-paced online course, consisting of video
                lectures, hands-on coding exercises, and quizzes. You can
                complete the course at your own pace within the 8-week access
                period.
              </p>
              <h4 className="text-xl font-semibold mt-4">Prerequisites:</h4>
              <p className="text-gray-700 mt-2">
                No prior programming experience is required, but basic computer
                literacy is recommended.
              </p>
            </div>

            {/* Right Column */}
            <div>
              <h4 className="text-xl font-semibold">
                Who Should Take This Course:
              </h4>
              <ul className="list-disc ml-5 text-gray-700 mt-2">
                <li>Beginners interested in learning programming.</li>
                <li>
                  Individuals looking to add {course.course_name} to their
                  skillset.
                </li>
                <li>Students preparing for computer science courses.</li>
              </ul>
              <h4 className="text-xl font-semibold mt-4">Evaluate Yourself:</h4>
              <p className="text-gray-700 mt-2">
                Assessments provide feedback on your progress throughout the
                course. Click <b>"Take Quizz"</b> to start!
              </p>
              {Math.ceil((played / duration) * 100) >= 98 ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/assessment/${course.course_id}`)}
                >
                  Quizz
                </button>
              ) : (
                <button
                  className="bg-gray-400 text-white px-4 py-2 mt-4 rounded"
                  onClick={showModal}
                >
                  Quizz
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border w-full shadow-lg rounded-md bg-white py-5 mt-8">
          <div className="mt-8">
            <h4 className="text-lg font-bold">Description:</h4>
            <p className="italic text-gray-600">{course.description}</p>
          </div>
          <div className="mt-6 text-gray-700">
            <h4 className="font-semibold">Instructor: {course.instructor}</h4>
            <h4 className="mt-2">Content type: Video</h4>
          </div>
          <button
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/learnings")}
          >
            Back
          </button>
        </div>
        <Modal
          title="Note:"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p className="text-black font-semibold">
            Complete 100% of your course to take Quizz
          </p>
        </Modal>
        {popup && (
          <p className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
            Complete 100% of your course to take Quizz
          </p>
        )}
        <div className="w-full mt-8 border">
          <div className="shadow-md rounded-md bg-white p-6">
            <h3 className="text-lg font-bold">Progress:</h3>
            <Progress
              percent={Math.ceil((played / duration) * 100)}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              showInfo={false}
            />
            <h3 className="mt-6 text-lg font-bold">Report:</h3>
            <p>
              You have completed{" "}
              <span className="text-blue-500 font-semibold">
                {Math.ceil((played / duration) * 100)}%
              </span>{" "}
              of this course.
            </p>
          </div>
        </div>
        <button
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate(`/discussion/${course.course_id}`)}
        >
          Discussions
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Course;
