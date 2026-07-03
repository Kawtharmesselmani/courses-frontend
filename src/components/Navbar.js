import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Remove register link - only show login for non-authenticated users
  const navLinks = user && user.user_type === 'student' ? [
    { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/student/courses', label: 'My Courses', icon: '📚' },
  ] : user && user.user_type === 'admin' ? [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/courses', label: 'Courses', icon: '📖' },
    { path: '/admin/students', label: 'Students', icon: '👥' },
    { path: '/admin/enrollments', label: 'Enrollments', icon: '📝' },
    { path: '/admin/materials', label: 'Materials', icon: '📁' },
  ] : [
    { path: '/', label: 'Home', icon: '🏠' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-modern">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl font-bold">CL</span>
            </div>
            <span className="text-2xl font-display font-bold gradient-text">CodeLab</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-secondary-700 hover:bg-white/20 hover:text-primary-600'
                }`}
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-6 py-2 rounded-xl font-semibold transition-all duration-200 bg-primary-500 text-white hover:bg-primary-600"
              >
                <span>🔑</span>
                <span>Login</span>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center"
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-secondary-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-secondary-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-secondary-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-700 hover:bg-white/20'
                }`}
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary-500 text-white"
              >
                <span>🔑</span>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;