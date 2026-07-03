import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const StudentCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      // First get student ID
      const dashboardResponse = await axios.get(`https://coursessystem.onrender.com/api/student/${user.user_id}/dashboard`);
      setCourses(dashboardResponse.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-gray-600">Here are all the courses you're enrolled in</p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">No Courses Yet</h2>
          <p className="text-gray-600">You haven't been enrolled in any courses.</p>
          <p className="text-gray-500 mt-2">Please contact the admin to get access to courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.course_id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={`https://coursessystem.onrender.com/uploads/${course.image}`}
                alt={course.course_name}
                className="w-full h-48 object-cover"
                onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Course+Image'}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.course_name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-500">📚 {course.lesson} lessons</span>
                  <span className="text-gray-500">⏱️ {course.hours} hours</span>
                </div>
                
                <Link
                  to={`/student/course/${course.course_id}/materials`}
                  className="block w-full bg-blue-500 text-white py-2 rounded-lg text-center hover:bg-blue-600 transition"
                >
                  Access Course Materials →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;