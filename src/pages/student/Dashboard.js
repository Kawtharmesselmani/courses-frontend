import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`https://coursessystem.onrender.com/api/student/${user.user_id}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {dashboardData?.student?.full_name}!</h1>
        <p className="text-gray-600">Your personal learning dashboard</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        
        {dashboardData?.courses?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You're not enrolled in any courses yet.</p>
            <p className="text-gray-600">Please contact the admin to get enrolled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData?.courses?.map((course) => (
              <div key={course.course_id} className="border rounded-lg overflow-hidden">
                <img 
                  src={`https://coursessystem.onrender.com/uploads/${course.image}`}
                  alt={course.course_name}
                  className="w-full h-40 object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{course.course_name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <Link
                    to={`/student/course/${course.course_id}/materials`}
                    className="block w-full bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600 transition"
                  >
                    Open Course Materials
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;