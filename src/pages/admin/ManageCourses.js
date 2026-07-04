import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = "https://coursessystem.onrender.com";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    hours: "",
    lesson: "",
    price: "",
    discount: "",
    status: "active",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const { token } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showMessage("error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      course_name: "",
      description: "",
      hours: "",
      lesson: "",
      price: "",
      discount: "",
      status: "active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      course_name: formData.course_name,
      description: formData.description,
      hours: formData.hours,
      lesson: formData.lesson,
      price: formData.price,
      discount: formData.discount,
      status: formData.status,
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (editingCourse) {
        await axios.put(
          `${API_URL}/api/courses/${editingCourse.course_id}`,
          dataToSend,
          config
        );

        showMessage("success", "Course updated successfully");
      } else {
        await axios.post(`${API_URL}/api/courses`, dataToSend, config);

        showMessage("success", "Course created successfully");
      }

      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      showMessage(
        "error",
        error.response?.data?.error || "Failed to save course"
      );
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);

    setFormData({
      course_name: course.course_name || "",
      description: course.description || "",
      hours: course.hours || "",
      lesson: course.lesson || "",
      price: course.price || "",
      discount: course.discount || "",
      status: course.status || "active",
    });

    setShowModal(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`${API_URL}/api/courses/${courseId}`, config);

        showMessage("success", "Course deleted successfully");
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        showMessage("error", "Failed to delete course");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  return (
    <div className="container-modern py-8">
      {/* Message Alert */}
      {message.text && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Courses</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + Add New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Course Name
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hours
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lessons
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Discount
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.course_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{course.course_id}</td>

                  <td className="px-6 py-4 font-medium">
                    {course.course_name}
                  </td>

                  <td className="px-6 py-4">{course.hours}h</td>

                  <td className="px-6 py-4">{course.lesson}</td>

                  <td className="px-6 py-4">${course.price}</td>

                  <td className="px-6 py-4">
                    {course.discount ? `${course.discount}%` : "0%"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`badge ${
                        course.status === "active"
                          ? "badge-success"
                          : course.status === "upcoming"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course.course_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Course Name *</label>
                  <input
                    type="text"
                    name="course_name"
                    required
                    value={formData.course_name}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Description *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Hours *</label>
                    <input
                      type="number"
                      name="hours"
                      required
                      value={formData.hours}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="input-label">Lessons *</label>
                    <input
                      type="number"
                      name="lesson"
                      required
                      value={formData.lesson}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="input-label">Discount (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn-primary">
                    {editingCourse ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;