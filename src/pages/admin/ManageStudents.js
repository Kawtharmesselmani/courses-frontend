import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const { token } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const response = await axios.get('https://coursessystem.onrender.com/api/students', config);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      showMessage('error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      if (editingStudent) {
        // Update student
        await axios.put(`https://coursessystem.onrender.com/api/students/${editingStudent.student_id}`, formData, config);
        showMessage('success', 'Student updated successfully');
      } else {
        // Create student
        if (!formData.password) {
          showMessage('error', 'Password is required');
          return;
        }
        await axios.post('https://coursessystem.onrender.com/api/students', formData, config);
        showMessage('success', 'Student created successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      showMessage('error', error.response?.data?.error || 'Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      email: student.email,
      password: '',
      full_name: student.full_name,
      phone: student.phone,
      address: student.address
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This will remove all their enrollments.')) {
      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        await axios.delete(`https://coursessystem.onrender.com/api/students/${studentId}`, config);
        showMessage('success', 'Student deleted successfully');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        showMessage('error', 'Failed to delete student');
      }
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      phone: '',
      address: ''
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading students...</div>;
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
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + Add New Student
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{student.student_id}</td>
                <td className="px-6 py-4 font-medium">{student.full_name}</td>
                <td className="px-6 py-4">{student.username}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.phone}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEdit(student)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(student.student_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Student */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="input-label">Username *</label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="input-label">
                      {editingStudent ? 'New Password (optional)' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      required={!editingStudent}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input"
                      placeholder={editingStudent ? 'Leave blank to keep current' : 'Enter password'}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="input"
                  />
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
                    {editingStudent ? 'Update' : 'Create'}
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

export default ManageStudents;