import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { WHATSAPP_NUMBER, UPLOADS_URL, DEFAULT_IMAGE } from '../utils/constants';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://coursessystem.onrender.com/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello, I want to register in the ${course.course_name}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      finished: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading course details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchCourseDetails} />;
  }

  if (!course) {
    return <ErrorMessage message="Course not found" />;
  }

  const originalPrice = course.price;
  const discountedPrice = course.discount > 0 
    ? (course.price - (course.price * course.discount / 100)).toFixed(2)
    : course.price;
  const savings = course.discount > 0 
    ? (course.price - discountedPrice).toFixed(2)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Courses
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Course Image */}
          <div className="md:w-1/2">
            <img 
              src={course.image ? `${UPLOADS_URL}/${course.image}` : DEFAULT_IMAGE}
              alt={course.course_name}
              className="w-full h-96 object-cover"
              onError={(e) => e.target.src = DEFAULT_IMAGE}
            />
          </div>
          
          {/* Course Info */}
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(course.status)}`}>
                {course.status.toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.course_name}</h1>
            
            <div className="flex items-center space-x-4 mb-6 text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.hours} Hours</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{course.lesson} Lessons</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold text-blue-600">${discountedPrice}</span>
                {course.discount > 0 && (
                  <>
                    <span className="ml-3 text-xl text-gray-500 line-through">${originalPrice}</span>
                    <span className="ml-3 text-green-600 font-semibold">Save ${savings}</span>
                  </>
                )}
              </div>
              {course.discount > 0 && (
                <p className="text-sm text-green-600">Special offer! {course.discount}% off</p>
              )}
            </div>
            
            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 0C5.384 0 0 5.384 0 12.032c0 2.128.558 4.222 1.606 6.033L0 24l6.05-1.574c1.77.966 3.77 1.478 5.83 1.478 6.648 0 12.032-5.384 12.032-12.032S18.68 0 12.032 0zm0 2.048c5.514 0 9.984 4.47 9.984 9.984s-4.47 9.984-9.984 9.984c-1.8 0-3.56-.482-5.104-1.396l-.364-.212-3.592.936.936-3.566-.212-.364c-.914-1.544-1.396-3.304-1.396-5.104 0-5.514 4.47-9.984 9.984-9.984z"/>
              </svg>
              <span>Register via WhatsApp</span>
            </button>
          </div>
        </div>
        
        {/* Course Description */}
        <div className="p-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Course Description</h2>
          <p className="text-gray-700 leading-relaxed">{course.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;