import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Fetch students
      const studentsRes = await axios.get('https://coursessystem.onrender.com/api/students', config);
      // Fetch courses
      const coursesRes = await axios.get('https://coursessystem.onrender.com/api/courses');
      // Fetch enrollments
      const enrollmentsRes = await axios.get('https://coursessystem.onrender.com/api/enrollments', config);
      
      const totalRevenue = enrollmentsRes.data.reduce((sum, e) => sum + parseFloat(e.price), 0);
      
      setStats({
        totalStudents: studentsRes.data.length,
        totalCourses: coursesRes.data.length,
        totalEnrollments: enrollmentsRes.data.length,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { title: 'Manage Courses', icon: '📚', path: '/admin/courses', color: 'bg-blue-500', description: 'Add, edit, or remove courses' },
    { title: 'Manage Students', icon: '👥', path: '/admin/students', color: 'bg-green-500', description: 'View and manage student accounts' },
    { title: 'Manage Enrollments', icon: '📝', path: '/admin/enrollments', color: 'bg-purple-500', description: 'Enroll students in courses' },
    { title: 'Course Materials', icon: '📁', path: '/admin/materials', color: 'bg-orange-500', description: 'Add and manage course content' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-modern py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your courses today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">👥</div>
            <div className="text-2xl font-bold text-primary-600">{stats.totalStudents}</div>
          </div>
          <h3 className="text-gray-600 font-medium">Total Students</h3>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📚</div>
            <div className="text-2xl font-bold text-primary-600">{stats.totalCourses}</div>
          </div>
          <h3 className="text-gray-600 font-medium">Total Courses</h3>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📝</div>
            <div className="text-2xl font-bold text-primary-600">{stats.totalEnrollments}</div>
          </div>
          <h3 className="text-gray-600 font-medium">Enrollments</h3>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">💰</div>
            <div className="text-2xl font-bold text-primary-600">${stats.totalRevenue}</div>
          </div>
          <h3 className="text-gray-600 font-medium">Total Revenue</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="card p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;