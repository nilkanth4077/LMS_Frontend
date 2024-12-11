import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "../components/Navbar";

function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.pathname.split("/")[2];
  const [test, setTest] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [totalQsns, SetTotalQsns] = useState(0);
  const [marks, setMarks] = useState(0);
  const [previousMarks, setPreviousMarks] = useState(0);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  useEffect(() => {
    fetch(`http://localhost:8080/user/questions/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setTest(res);
        SetTotalQsns(res.length);
        setSelectedAnswers(new Array(res.length).fill(false));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [courseId]);

  useEffect(() => {
    if (userId && courseId) {
      fetch(`http://localhost:8080/user/assessment/get/${userId}/${courseId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch assessment marks");
          }
          return res.text();
        })
        .then((marks) => {
          const parsedMarks = parseFloat(marks);
          setPreviousMarks(isNaN(parsedMarks) ? 0 : parsedMarks);
        })
        .catch((error) =>
          console.error("Error fetching previous marks:", error)
        );
    }
  }, [userId, courseId]);

  const handleRadioChange = (questionIndex, selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    const qsn = test[questionIndex];
    if (qsn.answer === selectedOption) {
      setCorrectCount(correctCount + 1);
      updatedSelectedAnswers[questionIndex] = true;
    } else if (updatedSelectedAnswers[questionIndex] === true) {
      setCorrectCount(correctCount - 1);
      updatedSelectedAnswers[questionIndex] = false;
    }
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleMarks = () => {
    const calculatedMarks = (correctCount / totalQsns) * 100;
    setMarks(calculatedMarks);
    const data = {
      courseId: courseId,
      userId: userId,
      marks: calculatedMarks,
    };
    axios
      .post(
        `http://localhost:8080/user/assessment/add/${userId}/${courseId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Request successful:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const showModal = () => {
    setOpenModal(true);
  };

  const handleOk = () => {
    setOpenModal(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  let message = "";
  if (marks >= 90) {
    message = "Outstanding 🌟 - You're a genius!";
  } else if (marks >= 85) {
    message = "Excellent ✨ - Keep it up!";
  } else if (marks >= 70) {
    message = "Good 😊 - You're doing well!";
  } else if (marks >= 50) {
    message = "Average 😌 - Needs improvement.";
  } else if (marks >= 35) {
    message = "Poor 😒 - Try harder next time.";
  } else {
    message = "Failed 😔 - Don't give up!";
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen mt-10">
        <div className="flex items-center mb-6">
          <button
            type="submit"
            id="backbtn"
            className="text-white bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 flex items-center"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            <FontAwesomeIcon icon={faBackward} className="mr-2" /> Back
          </button>
          <h1 className="ml-auto text-2xl font-bold bg-blue-600 text-white py-2 px-4 rounded">
            Assessment Questions
          </h1>
        </div>
        <div>
          <h3 className="text-left mb-3">
            Your Best Assessment Score:{" "}
            <span className="font-bold">{previousMarks}</span>
          </h3>
        </div>
        <div className="space-y-6">
          {test.map((question, index) => (
            <div
              key={question.id}
              className="bg-white p-4 rounded shadow-md border"
            >
              <h3 className="font-semibold text-lg mb-2">
                {question.question}
              </h3>
              <div className="space-y-2">
                {[
                  question.option1,
                  question.option2,
                  question.option3,
                  question.option4,
                ].map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-3 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      name={`question_${question.no}`}
                      onChange={() => handleRadioChange(index, option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(0)}
            className="text-white bg-red-600 hover:bg-red-700 rounded px-6 py-2"
          >
            Reset
          </button>
          <button
            onClick={() => {
              handleMarks();
              setOpenModal(true);
            }}
            className="text-white bg-green-600 hover:bg-green-700 rounded px-6 py-2"
          >
            Submit
          </button>
        </div>
        <Modal
          id="poppup"
          open={openModal}
          onOk={handleOk}
          onCancel={handleCancel}
          className="p-6"
        >
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Assessment Result
          </h2>
          <h1 className="text-center text-2xl">{message}</h1>
          <h3 className="text-center text-lg">
            You scored {marks.toFixed(2)}%
          </h3>
          <p className="text-center text-sm text-gray-600 mt-2">
            <span className="font-bold">Note:</span> Unattempted questions count
            as zero marks
          </p>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default Assessment;
