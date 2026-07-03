import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://coursessystem.onrender.com/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading amazing courses..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchCourses} />;
  }

  return (
    <div className="container-modern py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="section-title">
          Learn From the Best{' '}
          <span className="gradient-text">Online Courses</span>
        </h1>
        <p className="section-subtitle">
          Discover top-rated courses taught by industry experts.
          Start your learning journey today!
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-600">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div 
              key={course.course_id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;