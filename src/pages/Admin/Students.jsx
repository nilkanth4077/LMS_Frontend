import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdminSideBar from "../../pages/Admin/AdminSideBar";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from the API
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    try {
      const response = await fetch("http://localhost:8081/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      if (response.status === 403) {
        throw new Error("You are not authorized to access this data.");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
    // Add navigation to edit page or modal logic here
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:8081/admin/users/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          setStudents(students.filter((student) => student.id !== id)); // Remove the deleted user
          alert("User deleted successfully!");
        } else {
          alert("Failed to delete the user.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the user.");
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
    <AdminSideBar />
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Student List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    #
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Email
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {student.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {student.email}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {student.role}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                        onClick={() => handleEdit(student.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
