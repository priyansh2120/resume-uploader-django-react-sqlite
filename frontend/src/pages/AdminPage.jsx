import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/resume/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = response.data.map(resume => ({
        ...resume,
        techKnowledge: parseKnowledgeField(resume.techKnowledge),
        domainKnowledge: parseKnowledgeField(resume.domainKnowledge),
      }));
      setResumes(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const parseKnowledgeField = (field) => {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      return [field];
    }
  };

  const toggleApproval = async (resumeId, isApproved) => {
    try {
      // Get userId from cookie
      const userId = Cookies.get('userId');
      const accessToken = Cookies.get('accessToken');
      // Send request with userId in payload
      await axios.put(
        `http://127.0.0.1:8000/resume/${resumeId}/toggle-approval`,
        { isApproved: !isApproved, modified_by: userId },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      
      // Refresh data after toggling approval
      fetchData();
    } catch (error) {
      console.error('Error toggling approval:', error);
    }
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Page</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2 text-left">
          <button
            onClick={() => navigate('/resumes')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Listing Screen
          </button>
        </div>
        <div className="w-1/2 text-right">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Name</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Total Experience</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Expected Salary</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Technical Knowledge</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Domain Knowledge</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResumes.map((resume, index) => (
            <tr key={resume.resumeId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-2 px-4 border-b border-gray-200">{resume.name}</td>
              <td className="py-2 px-4 border-b border-gray-200">{resume.totalExperience}</td>
              <td className="py-2 px-4 border-b border-gray-200">{resume.expectedSalary}</td>
              <td className="py-2 px-4 border-b border-gray-200">{resume.techKnowledge.join(', ')}</td>
              <td className="py-2 px-4 border-b border-gray-200">{resume.domainKnowledge.join(', ')}</td>
              <td className="py-2 px-4 border-b border-gray-200">
              <button
                onClick={() => toggleApproval(resume.resumeId, resume.isApproved)}
                className={`px-4 py-2 rounded w-32 ${resume.isApproved ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
              >
                {resume.isApproved ? 'Revoke Approval' : 'Approve'}
              </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
