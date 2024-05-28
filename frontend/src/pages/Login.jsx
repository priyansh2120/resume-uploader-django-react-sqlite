import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('accessToken'));
  const [userId, setUserId] = useState(Cookies.get('userId'));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/login/', {
        userId: username,
        password: password
      });
      if (response.status === 200) {
        Cookies.set('accessToken', response.data.access, { expires: 1 }); // Set access token cookie
        Cookies.set('isAdmin', response.data.is_admin, { expires: 1 }); // Set isAdmin flag cookie
        Cookies.set('userId', username); // Set userId cookie
        setUserId(username); // Set userId state
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 font-roboto">
      {loggedIn ? (
        <Navigate to="/resumes" /> // Redirect to listing screen if logged in
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-80">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Login</h2>
          <input
            className="w-full py-2 px-4 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative w-full mb-2">
            <input
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Error</h3>
            <p>{error}</p>
            <button
              className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              onClick={handleCloseErrorModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
