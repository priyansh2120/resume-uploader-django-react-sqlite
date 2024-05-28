import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ListingScreen = () => {
  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCell, setExpandedCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
    fetchAdminStatus();
  }, []);

  const fetchResumes = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/resume/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const approvedResumes = response.data.filter(resume => resume.isApproved);
      const formattedResumes = approvedResumes.map(resume => ({
        ...resume,
        techKnowledge: parseArray(resume.techKnowledge),
        domainKnowledge: parseArray(resume.domainKnowledge),
        keywords: parseArray(resume.keywords),
      }));
      setResumes(formattedResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      navigate('/login');
    }
  };
  const fetchAdminStatus = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/user/check-admin/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Error fetching admin status:', error);

    }
  };

  const parseArray = (str) => {
    try {
      const parsedArray = JSON.parse(str);
      return Array.isArray(parsedArray) ? parsedArray : [];
    } catch (error) {
      console.error('Error parsing array:', error);
      return [];
    }
  };

  const toggleExpand = (rowIndex, cellIndex) => {
    if (expandedCell === null || expandedCell.rowIndex !== rowIndex || expandedCell.cellIndex !== cellIndex) {
      setExpandedCell({ rowIndex, cellIndex });
    } else {
      setExpandedCell(null);
    }
  };

  const hideExpandedCell = () => {
    setExpandedCell(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredResumes = resumes.filter(resume => {
    return Object.values(resume).some(value => {
      if (typeof value === 'string') {
        return new RegExp(searchQuery, 'i').test(value);
      } else if (Array.isArray(value)) {
        return value.some(item => new RegExp(searchQuery, 'i').test(item));
      }
      return false;
    });
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      await axios.post('http://127.0.0.1:8000/user/logout/', null, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      Cookies.remove('accessToken');
      Cookies.remove('userId');
      Cookies.remove('isAdmin');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  


  return (
    <div className='p-8 m-4'>
      {/* <h2>Listing Screen</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1 border border-gray-400 rounded-md px-4 py-2 mr-2 focus:outline-none"
        />
        <button onClick={handleOpenModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
          Add Resume
        </button>
      </div>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
        Logout
      </button>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full overflow-y-auto max-h-full">
          <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-600 focus:outline-none"
            >
              X
            </button>
            <FileUpload onClose={handleCloseModal} />
          </div>
        </div>
      )}
      {isAdmin && (
        <Link to="/admin" className="block text-blue-500 hover:underline mb-4">
          Admin Page
        </Link>
      )} */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold center">Listing Screen</h2>
        {isAdmin && (
          <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
            Admin Panel
          </Link>
        )}
      </div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleOpenModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
          Add Resume
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1 border border-gray-400 rounded-md px-4 py-2 mx-4 focus:outline-none"
        />
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none">
          Logout
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full overflow-y-auto max-h-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-600 focus:outline-none"
            >
              X
            </button>
            <FileUpload onClose={handleCloseModal} />
          </div>
        </div>
      )}
      







      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Date of Birth</th>
            <th className="border border-gray-400 px-4 py-2">Total Experience</th>
            <th className="border border-gray-400 px-4 py-2">Expected Salary</th>
            <th className="border border-gray-400 px-4 py-2">City</th>
            <th className="border border-gray-400 px-4 py-2">State</th>
            <th className="border border-gray-400 px-4 py-2">Country</th>
            <th className="border border-gray-400 px-4 py-2">Technical Knowledge</th>
            <th className="border border-gray-400 px-4 py-2">Domain Knowledge</th>
            <th className="border border-gray-400 px-4 py-2">Keywords</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResumes.map((resume, rowIndex) => (
            <tr key={resume.resumeId} className={rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="border border-gray-400 px-4 py-2 text-left">{resume.name}</td>
              <td className="border border-gray-400 px-4 py-2 text-left">{new Date(resume.dateOfBirth).toLocaleDateString()}</td>
              <td className="border border-gray-400 px-4 py-2 text-left">{resume.totalExperience}</td>
              <td className="border border-gray-400 px-4 py-2 text-left">{resume.expectedSalary}</td>
              <td className="border border-gray-400 px-4 py-2 text-left">{resume.city}</td>
              <td className="border border-gray-400 px-4 py-2 text-left">{resume.state}</td>
              <td className="border border-gray-400 px-4 py-2 text-left">{resume.country}</td>
              <td
                className="border border-gray-400 px-4 py-2 text-left cursor-pointer"
                onMouseEnter={() => toggleExpand(rowIndex, 7)}
                onMouseLeave={hideExpandedCell}
              >
                <div className="truncate" style={{ maxWidth: '200px' }}>
                  {resume.techKnowledge.join(', ')}
                </div>
                {expandedCell && expandedCell.rowIndex === rowIndex && expandedCell.cellIndex === 7 && (
                  <div className="absolute bg-white border border-gray-400 rounded-lg shadow-lg p-4">
                    {resume.techKnowledge.join(', ')}
                  </div>
                )}
              </td>
              <td
                className="border border-gray-400 px-4 py-2 text-left cursor-pointer"
                onMouseEnter={() => toggleExpand(rowIndex, 8)}
                onMouseLeave={hideExpandedCell}
              >
                <div className="truncate" style={{ maxWidth: '200px' }}>
                  {resume.domainKnowledge.join(', ')}
                </div>
                {expandedCell && expandedCell.rowIndex === rowIndex && expandedCell.cellIndex === 8 && (
                  <div className="absolute bg-white border border-gray-400 rounded-lg shadow-lg p-4">
                    {resume.domainKnowledge.join(', ')}
                  </div>
                )}
              </td>
              <td
                className="border border-gray-400 px-4 py-2 text-left cursor-pointer"
                onMouseEnter={() => toggleExpand(rowIndex, 9)}
                onMouseLeave={hideExpandedCell}
              >
                <div className="truncate" style={{ maxWidth: '200px' }}>
                  {resume.keywords.join(', ')}
                </div>
                {expandedCell && expandedCell.rowIndex === rowIndex && expandedCell.cellIndex === 9 && (
                  <div className="absolute bg-white border border-gray-400 rounded-lg shadow-lg p-4">
                    {resume.keywords.join(', ')}
                  </div>
                )}
                </td>
              <td className="border border-gray-400 px-4 py-2 text-left">
                <Link to={`/view-resume/${resume.resumeId}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListingScreen;

