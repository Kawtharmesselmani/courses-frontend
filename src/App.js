import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import CourseMaterials from './pages/student/CourseMaterials';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageStudents from './pages/admin/ManageStudents';
import ManageEnrollments from './pages/admin/ManageEnrollments';
import ManageMaterials from './pages/admin/ManageMaterials';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <Navbar />
          <main className="pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/login" element={<Login />} />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <PrivateRoute allowedTypes={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } />
              <Route path="/student/courses" element={
                <PrivateRoute allowedTypes={['student']}>
                  <StudentCourses />
                </PrivateRoute>
              } />
              <Route path="/student/course/:id/materials" element={
                <PrivateRoute allowedTypes={['student']}>
                  <CourseMaterials />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <PrivateRoute allowedTypes={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              <Route path="/admin/courses" element={
                <PrivateRoute allowedTypes={['admin']}>
                  <ManageCourses />
                </PrivateRoute>
              } />
              <Route path="/admin/students" element={
                <PrivateRoute allowedTypes={['admin']}>
                  <ManageStudents />
                </PrivateRoute>
              } />
              <Route path="/admin/enrollments" element={
                <PrivateRoute allowedTypes={['admin']}>
                  <ManageEnrollments />
                </PrivateRoute>
              } />
              <Route path="/admin/materials" element={
                <PrivateRoute allowedTypes={['admin']}>
                  <ManageMaterials />
                </PrivateRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;