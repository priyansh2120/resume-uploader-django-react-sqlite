import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Signup = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '', // New field for confirming password
    isAdmin: false,
  });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  // const [loggedIn, setLoggedIn] = useState(!!Cookies.get('accessToken'));
  const navigate = useNavigate();

  const checkLoggedIn = () => {
    if (Cookies.get('accessToken')  !== undefined) {
      navigate('/resumes');
    }

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (signupSuccess) {
      navigate('/login'); // Redirect to login page
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setSignupError('Passwords do not match');
      setOpenDialog(true);
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/user/signup/', formData);
      console.log('Signup successful', response.data);
      setSignupSuccess(true);
      setOpenDialog(true);
      setFormData({
        userId: '',
        password: '',
        confirmPassword: '', // Reset confirm password
        isAdmin: false,
      });
    } catch (error) {
      console.error('Signup failed', error.response.data);
      if (error.response.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage === 'User already exists') {
          setSignupError('User already exists');
        } else if (errorMessage === 'Password must be at least 8 characters long') {
          setSignupError('Password must be at least 8 characters long');
        }
         else {
          setSignupError('Signup failed. Please try again.');
        }
      } else {
        setSignupError('Signup failed. Please try again.');
      }
      setOpenDialog(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    checkLoggedIn();
  }
  ,[]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 font-roboto">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              Username / User ID
            </label>
            <input
              type="text"
              name="userId"
              id="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 px-3 py-2"
              />
              
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 px-3 py-2"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
          </div>
          <div>
            <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700">
              Are you an admin?
            </label>
            <input
              type="checkbox"
              name="isAdmin"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={handleCheckboxChange}
              className="mt-1 border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={handleLoginRedirect} className="text-indigo-600 hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{signupSuccess ? 'Signup Successful' : 'Signup Failed'}</DialogTitle>
        <DialogContent>
          <p>{signupSuccess ? 'Signup successful. You can proceed to login.' : signupError}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          {!signupSuccess && (
            <Button onClick={() => navigate('/login')} color="primary">
              Go to Login
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signup;
