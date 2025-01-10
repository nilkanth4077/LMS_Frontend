import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Navbar";

function Discussion() {
  const taskRef = React.useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState([]);
  const [course, setCourse] = useState();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  console.log("User ID: ", userId);

  const [formData, setFormData] = useState({
    name: user.firstName,
    course_id: courseId,
    content: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8081/user/discussion/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data);
        console.log("Disc data: ", data);
      });

    fetch(`http://localhost:8081/user/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourse(data));
  }, []);

  const addTask = () => {
    if (taskRef.current && taskRef.current.value.trim() !== "") {
      const newMessage = taskRef.current.value.trim();
      setFormData({ ...formData, content: newMessage });

      fetch("http://localhost:8081/user/discussion/addMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(() => {
        taskRef.current.value = "";
        setMessage([...message, formData]);
        setFormData({ ...formData, content: "" });
        window.location.reload();
      });
    } else {
      alert("Enter a Message");
    }
  };
  console.log(course);

  return (
    <>
      <Header />
      <h3 className="text-center text-white py-4 text-lg italic font-bold bg-blue-900 mt-14">
        Discussion Forum for '{course?.course_name}'
      </h3>
      <div className="Forum mt-12 flex flex-col h-screen">
        {/* Chat Messages Section */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-white border"
          style={{ maxHeight: "60vh" }}
        >
          {message.length > 0 && (
            <div className="taskContainer flex flex-col space-y-4">
              {message
                .slice()
                .reverse()
                .map((value, key) => {
                  if (value.content.trim() !== "") {
                    const isUser = value.uname === user.firstName;

                    return (
                      <div
                        key={key}
                        className={`flex ${
                          isUser ? "justify-end" : "justify-start"
                        } w-full`}
                      >
                        <div
                          className={`p-3 max-w-[70%] rounded-lg ${
                            isUser
                              ? "bg-blue-100 text-black"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          <div
                            className={`text-xs font-bold mb-1 ${
                              isUser ? "text-right" : "text-left"
                            } text-brown-500`}
                          >
                            {value.uname}
                          </div>
                          <p>{value.content}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          )}
        </div>

        {/* Chat Input Section */}
        <div className="p-4 border-t bg-gray-100 flex items-center">
          <textarea
            cols={1}
            rows={2}
            type="text"
            ref={taskRef}
            name="taskInput"
            value={formData.content}
            className="flex-1 border rounded-md p-2 resize-none mr-2"
            placeholder="Type your message..."
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Discussion;
