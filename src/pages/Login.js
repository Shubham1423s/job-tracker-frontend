import { useState } from 'react';
import { auth } from '../services/api';




export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = isLogin 
        ? { userName: username, password }
        : { userName: username, email, password };
      
      console.log('Sending payload:', payload);
      console.log('Endpoint:', isLogin ? 'login' : 'register');
      
      const { data } = isLogin 
        ? await auth.login(payload)
        : await auth.register(payload);
      
      console.log('Response data:', data);
      
      
      const token = data.accessToken || data.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      
      localStorage.setItem('token', token);
      
      
      onLogin(token);
      
      
      console.log(isLogin ? 'Login successful!' : 'Registration successful!');
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      alert('Error: ' + (err.response?.data?.message || err.message));
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
                  <label className="form-label">Username</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>
              <div className="text-center mt-3">
                <button 
                  className="btn btn-link"
                  onClick={() => setIsLogin(!isLogin)}
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