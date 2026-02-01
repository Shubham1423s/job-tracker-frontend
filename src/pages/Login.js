import { useState } from 'react';
import { auth } from '../services/api';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username || username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (username && username.length > 100) {
      newErrors.username = 'Username cannot exceed 100 characters';
    }

    // Email validation (only for registration)
    if (!isLogin) {
      if (!email || !email.includes('@')) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password && password.length > 50) {
      newErrors.password = 'Password cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const payload = isLogin 
        ? { userName: username.trim(), password }
        : { userName: username.trim(), email: email.trim(), password };
      
      const { data } = isLogin 
        ? await auth.login(payload)
        : await auth.register(payload);
      
      const token = data.accessToken || data.token;
      
      if (!token) {
        throw new Error('Authentication failed. Please try again.');
      }
      
      localStorage.setItem('token', token);
      onLogin(token);
      
    } catch (err) {
      console.error('Authentication error:', err);
      
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.response) {
        // Backend returned an error
        const status = err.response.status;
        const backendMessage = err.response.data?.message || err.response.data;
        
        if (status === 400) {
          errorMessage = backendMessage || 'Invalid input. Please check your information.';
        } else if (status === 401 || status === 403) {
          errorMessage = isLogin 
            ? 'Invalid username or password.' 
            : 'Registration failed. Username or email may already exist.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = backendMessage || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">
                📋 Job Tracker
              </h2>
              <h4 className="text-center mb-4">
                {isLogin ? 'Login' : 'Register'}
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input 
                    type="text"
                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    placeholder="At least 3 characters"
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value);
                      setErrors({...errors, username: ''});
                    }}
                    minLength={3}
                    maxLength={100}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input 
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setErrors({...errors, email: ''});
                      }}
                      maxLength={255}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <input 
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setErrors({...errors, password: ''});
                    }}
                    minLength={8}
                    maxLength={50}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <button 
                  className="btn btn-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                >
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}