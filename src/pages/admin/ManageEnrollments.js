import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    price: '',
    payment_status: 'paid'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        axios.get('https://coursessystem.onrender.com/api/enrollments', config),
        axios.get('https://coursessystem.onrender.com/api/students', config),
        axios.get('https://coursessystem.onrender.com/api/courses')
      ]);
      setEnrollments(enrollmentsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-fill price when course is selected
    if (name === 'course_id') {
      const selectedCourse = courses.find(c => c.course_id === parseInt(value));
      if (selectedCourse) {
        setFormData(prev => ({ ...prev, course_id: value, price: selectedCourse.price }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.post('https://coursessystem.onrender.com/api/enrollments', formData, config);
      showMessage('success', 'Student enrolled successfully');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating enrollment:', error);
      showMessage('error', error.response?.data?.error || 'Failed to enroll student');
    }
  };

  const handleDelete = async (studentId, courseId) => {
    if (window.confirm('Are you sure you want to remove this enrollment?')) {
      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        await axios.delete(`https://coursessystem.onrender.com/api/enrollments/${studentId}/${courseId}`, config);
        showMessage('success', 'Enrollment removed successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        showMessage('error', 'Failed to remove enrollment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      course_id: '',
      price: '',
      payment_status: 'paid'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading enrollments...</div>;
  }

  return (
    <div className="container-modern py-8">
      {message.text && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Enrollments</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + New Enrollment
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.register_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{enrollment.full_name}</td>
                <td className="px-6 py-4">{enrollment.course_name}</td>
                <td className="px-6 py-4">${enrollment.price}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${enrollment.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {enrollment.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(enrollment.register_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleDelete(enrollment.student_id, enrollment.course_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for New Enrollment */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Enroll Student</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Select Student *</label>
                  <select
                    name="student_id"
                    required
                    value={formData.student_id}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Choose a student...</option>
                    {students.map(student => (
                      <option key={student.student_id} value={student.student_id}>
                        {student.full_name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Select Course *</label>
                  <select
                    name="course_id"
                    required
                    value={formData.course_id}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name} - ${course.price}
                      </option>
                    ))}
                  </select>
                </div>

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
                  <label className="input-label">Payment Status</label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
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
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Enroll
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

export default ManageEnrollments;