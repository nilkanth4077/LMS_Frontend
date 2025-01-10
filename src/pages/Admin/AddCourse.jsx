import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    course_name: "",
    price: "",
    instructor: "",
    description: "",
    p_link: "",
    y_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized! Please log in.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8081/admin/course/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        console.log("Course added successfully!");
        toast.success("Course added successfully!");
        setFormData({
          course_name: "",
          price: "",
          instructor: "",
          description: "",
          p_link: "",
          y_link: "",
        });
        setTimeout(() => navigate("/admin_dashboard"), 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Error occurred while adding the course");
      }
    } catch (error) {
      toast.error("Error occurred while adding the course. Please try again!");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Add New Course
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>

          <form className="mx-auto grid grid-cols-3 gap-4">
            <div className="mb-5">
              <label
                htmlFor="course_name"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Course Name
              </label>
              <input
                type="text"
                id="course_name"
                name="course_name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Your course name"
                value={formData.course_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="price"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Course Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Course Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="instructor"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Instructor
              </label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Tutor of the course"
                value={formData.instructor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="description"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Description goes here"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="p_link"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Photo Link
              </label>
              <input
                type="url"
                id="p_link"
                name="p_link"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter URL of the poster"
                value={formData.p_link}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="y_link"
                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
              >
                Youtube Video Link
              </label>
              <input
                type="url"
                id="y_link"
                name="y_link"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter the video link of YouTube"
                value={formData.y_link}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Course
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCourse;
