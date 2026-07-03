import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ManageMaterials = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    link: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const { token } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchMaterials();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://coursessystem.onrender.com/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      showMessage('error', 'Failed to load courses');
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://coursessystem.onrender.com/api/courses/${selectedCourse}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      showMessage('error', 'Failed to load materials');
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
      
      if (editingMaterial) {
        // Update material
        await axios.put(`https://coursessystem.onrender.com/api/materials/${editingMaterial.link_id}`, formData, config);
        showMessage('success', 'Material updated successfully');
      } else {
        // Create material
        await axios.post('https://coursessystem.onrender.com/api/materials', {
          course_id: selectedCourse,
          ...formData
        }, config);
        showMessage('success', 'Material added successfully');
      }
      
      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      showMessage('error', 'Failed to save material');
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      link: material.link
    });
    setShowModal(true);
  };

  const handleDelete = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        await axios.delete(`https://coursessystem.onrender.com/api/materials/${materialId}`, config);
        showMessage('success', 'Material deleted successfully');
        fetchMaterials();
      } catch (error) {
        console.error('Error deleting material:', error);
        showMessage('error', 'Failed to delete material');
      }
    }
  };

  const resetForm = () => {
    setEditingMaterial(null);
    setFormData({ title: '', link: '' });
  };

  return (
    <div className="container-modern py-8">
      {message.text && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Course Materials</h1>

      <div className="card p-6 mb-6">
        <label className="input-label">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="input"
        >
          <option value="">Choose a course...</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Materials</h2>
            <button 
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary"
            >
              + Add Material
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading materials...</div>
          ) : materials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No materials added yet</div>
          ) : (
            <div className="space-y-3">
              {materials.map((material, index) => (
                <div key={material.link_id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-lg mr-3">{index + 1}.</span>
                      <div>
                        <h3 className="font-semibold">{material.title}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-md">{material.link}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleEdit(material)}
                      className="text-blue-600 hover:text-blue-800 mr-3 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(material.link_id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Add/Edit Material */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingMaterial ? 'Edit Material' : 'Add Material'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Introduction to the Course"
                  />
                </div>

                <div>
                  <label className="input-label">Link/URL *</label>
                  <input
                    type="url"
                    name="link"
                    required
                    value={formData.link}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">YouTube URL, PDF link, or any resource link</p>
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
                    {editingMaterial ? 'Update' : 'Add'}
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

export default ManageMaterials;