import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ViewResumeScreen = () => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/resume/view/${resumeId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
        });
        const resumeData = response.data;
        
        // Parse the string fields to arrays
        resumeData.techKnowledge = JSON.parse(resumeData.techKnowledge);
        resumeData.domainKnowledge = JSON.parse(resumeData.domainKnowledge);
        resumeData.keywords = JSON.parse(resumeData.keywords);
        
        setResume(resumeData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching resume:', error);
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, accessToken]);

  const handleDownload = (fileUrl, fileName) => {
    const baseUrl = 'http://127.0.0.1:8000';
    const fullUrl = baseUrl + fileUrl;

    fetch(fullUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading file:', error));
  };

  const goBack = () => {
    navigate('/resumes');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!resume) {
    return <div>Resume not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Resume Details</h2>
        <button
          onClick={goBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Go Back to Listing Screen
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="font-semibold">Name:</div>
        <div>{resume.name}</div>
        
        <div className="font-semibold">Date of Birth:</div>
        <div>{new Date(resume.dateOfBirth).toLocaleDateString()}</div>
        
        <div className="font-semibold">Total Experience:</div>
        <div>{resume.totalExperience}</div>
        
        <div className="font-semibold">Expected Salary:</div>
        <div>{resume.expectedSalary}</div>
        
        <div className="font-semibold">City:</div>
        <div>{resume.city}</div>
        
        <div className="font-semibold">State:</div>
        <div>{resume.state}</div>
        
        <div className="font-semibold">Country:</div>
        <div>{resume.country}</div>
        
        <div className="font-semibold">Technical Knowledge:</div>
        <div>{resume.techKnowledge.join(', ')}</div>
        
        <div className="font-semibold">Domain Knowledge:</div>
        <div>{resume.domainKnowledge.join(', ')}</div>
        
        <div className="font-semibold">Keywords:</div>
        <div>{resume.keywords.join(', ')}</div>
        
        <div className="font-semibold">Brief Description:</div>
        <div dangerouslySetInnerHTML={{ __html: resume.briefDescription }} />
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => handleDownload(resume.pictureFile, 'photograph.jpg')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Photograph
        </button>
        <button
          onClick={() => handleDownload(resume.resumeFile, 'resume.docx')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default ViewResumeScreen;
