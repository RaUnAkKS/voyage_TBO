import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/Auth.css';

type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthProps {
  initialMode?: AuthMode;
}

const Auth: React.FC<AuthProps> = ({ initialMode = 'login' }) => {
  const [view, setView] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const location = useLocation();

  // Sync state with URL changes
  useEffect(() => {
    if (location.pathname === '/login') setView('login');
    else if (location.pathname === '/signup') setView('signup');
    else if (location.pathname === '/forgot-password') setView('forgot-password');
    
    setErrors({}); // Clear errors when switching modes
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email is required for all views
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password is only required for login and signup
    if (view !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (view === 'signup') {
        if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[0-9])/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one number';
        }
      }
    }

    // Name is only required for signup
    if (view === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (view === 'forgot-password') {
        console.log('Sending password reset link to:', formData.email);
        // TODO: Trigger backend password reset logic here
        alert('If an account exists, a reset link has been sent to your email.');
        navigate('/login');
      } else {
        console.log(`${view === 'login' ? 'Logging in' : 'Signing up'} with:`, formData);
        // TODO: Trigger login/signup logic here
        navigate('/');
      }
    }
  };

  // Dynamic text based on current view
  const getHeaderText = () => {
    if (view === 'login') return { title: 'Welcome Back', subtitle: 'Enter your details to access your events.' };
    if (view === 'signup') return { title: 'Create an Account', subtitle: 'Join us to start planning and exploring.' };
    return { title: 'Reset Password', subtitle: 'Enter your email and we will send you a reset link.' };
  };

  const headerInfo = getHeaderText();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">EventHub</Link>
          <h2>{headerInfo.title}</h2>
          <p>{headerInfo.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {view === 'signup' && (
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <UserIcon size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                />
              </div>
              {errors.name && <span className="error-text"><AlertCircle size={14} />{errors.name}</span>}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <span className="error-text"><AlertCircle size={14} />{errors.email}</span>}
          </div>

          {view !== 'forgot-password' && (
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
              </div>
              {errors.password && <span className="error-text"><AlertCircle size={14} />{errors.password}</span>}
            </div>
          )}

          {view === 'login' && (
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          )}

          <button type="submit" className="btn-submit">
            {view === 'login' && 'Sign In'}
            {view === 'signup' && 'Sign Up'}
            {view === 'forgot-password' && 'Send Reset Link'}
            {view === 'forgot-password' ? <RefreshCw size={18} /> : <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {view === 'login' && (
              <>
                Don't have an account?{' '}
                <button type="button" className="toggle-mode-btn" onClick={() => navigate('/signup')}>
                  Sign up
                </button>
              </>
            )}
            {view === 'signup' && (
              <>
                Already have an account?{' '}
                <button type="button" className="toggle-mode-btn" onClick={() => navigate('/login')}>
                  Log in
                </button>
              </>
            )}
            {view === 'forgot-password' && (
              <>
                Remember your password?{' '}
                <button type="button" className="toggle-mode-btn" onClick={() => navigate('/login')}>
                  Back to Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;