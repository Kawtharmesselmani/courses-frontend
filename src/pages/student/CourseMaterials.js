import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const CourseMaterials = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    checkEnrollment();
    fetchCourse();
    fetchMaterials();
  }, [id]);

  const checkEnrollment = async () => {
    try {
      const response = await axios.get(`https://coursessystem.onrender.com/api/student/${user.user_id}/dashboard`);
      const enrolled = response.data.courses.some(c => c.course_id === parseInt(id));
      setIsEnrolled(enrolled);
      if (!enrolled) {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`https://coursessystem.onrender.com/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`https://coursessystem.onrender.com/api/courses/${id}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const openMaterial = (link) => {
    // Check if it's a URL
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    } else {
      // Handle local files or other types
      window.open(`https://coursessystem.onrender.com/uploads/${link}`, '_blank');
    }
  };

  const getMaterialType = (link) => {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      return 'Video';
    } else if (link.includes('.pdf')) {
      return 'PDF';
    } else if (link.includes('.mp4')) {
      return 'Video';
    } else if (link.startsWith('http')) {
      return 'Link';
    } else {
      return 'File';
    }
  };

  const getMaterialIcon = (type) => {
    switch(type) {
      case 'Video':
        return '🎥';
      case 'PDF':
        return '📄';
      default:
        return '🔗';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading course materials...</div>
      </div>
    );
  }

  if (!isEnrolled) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{course?.course_name}</h1>
        <p className="text-gray-600">{course?.description}</p>
        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <span>📚 {course?.lesson} Lessons</span>
          <span>⏱️ {course?.hours} Hours</span>
          <span>💰 ${course?.price}</span>
        </div>
      </div>

      {/* Materials Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Course Materials</h2>
        
        {materials.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-600">No materials available for this course yet.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {materials.map((material, index) => {
              const materialType = getMaterialType(material.link);
              const icon = getMaterialIcon(materialType);
              
              return (
                <div 
                  key={material.link_id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
                  onClick={() => openMaterial(material.link)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{icon}</span>
                        <h3 className="text-lg font-semibold">
                          {index + 1}. {material.title}
                        </h3>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {materialType}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Show preview for YouTube videos */}
                  {materialType === 'Video' && material.link.includes('youtube.com') && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 truncate">
                        {material.link}
                      </div>
                    </div>
                  )}
                  
                  {/* Show file info for PDFs */}
                  {materialType === 'PDF' && (
                    <div className="mt-2 text-xs text-gray-500">
                      Click to view PDF document
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterials;