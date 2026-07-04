import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, onWhatsAppClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleWhatsApp = () => {
    const message = `Hello, I want to register in the ${course.course_name}`;
    const whatsappUrl = `https://wa.me/71270445?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    if (onWhatsAppClick) onWhatsAppClick(course);
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'badge-warning',
      active: 'badge-success',
      finished: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  const getImageUrl = () => {
    if (!imageError && course.image) {
      return `https://coursessystem.onrender.com/uploads/${course.image}`;
    }
    // Generate a nice gradient placeholder based on course name
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-yellow-500 to-orange-500'
    ];
    const colorIndex = course.course_id % colors.length;
    return null; // Will use fallback div
  };

  return (
    <div className="card group animate-fade-in">
      {/* Image Container with Fallback */}
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError ? (
          <img 
            src={getImageUrl()}
            alt={course.course_name}
            className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        ) : (
          // Beautiful Fallback Gradient
          <div className={`w-full h-full bg-gradient-to-br ${getImageUrl() || 'from-primary-500 to-primary-700'} flex items-center justify-center`}>
            <div className="text-center text-white p-4">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-75" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h8v4H8v-4z"/>
              </svg>
              <p className="font-semibold">{course.course_name}</p>
            </div>
          </div>
        )}
        
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="spinner w-8 h-8"></div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`badge ${getStatusBadge(course.status)} shadow-lg`}>
            {course.status}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-secondary-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {course.course_name}
        </h3>
        
        <p className="text-secondary-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Metrics */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center space-x-1 text-secondary-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.hours} hours</span>
          </div>
          <div className="flex items-center space-x-1 text-secondary-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{course.lesson} lessons</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          {course.discount > 0 ? (
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-primary-600">
                ${(course.price - (course.price * course.discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-secondary-400 line-through">
                ${course.price}
              </span>
              <span className="badge-success text-xs">
                -{course.discount}%
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-primary-600">
              ${course.price}
            </span>
          )}
        </div>
        
        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleWhatsApp}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.032 0C5.384 0 0 5.384 0 12.032c0 2.128.558 4.222 1.606 6.033L0 24l6.05-1.574c1.77.966 3.77 1.478 5.83 1.478 6.648 0 12.032-5.384 12.032-12.032S18.68 0 12.032 0z"/>
            </svg>
            <span>Contact on WhatsApp</span>
          </button>
          
          <Link
            to={`/course/${course.course_id}`}
            className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 rounded-xl font-semibold text-center hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;