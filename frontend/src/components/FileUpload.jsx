// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import KnowledgeInput from './KnowledgeInput';
// import Cookies from 'js-cookie';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import { useNavigate } from 'react-router-dom';

// const FileUpload = () => {
//   const [resumeFile, setResumeFile] = useState(null);
//   const [pictureFile, setPictureFile] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [techKnowledgeOptions, setTechKnowledgeOptions] = useState([]);
//   const [domainKnowledgeOptions, setDomainKnowledgeOptions] = useState([]);
//   const [keywordOptions, setKeywordOptions] = useState([]);
//   const [selectedTechKnowledge, setSelectedTechKnowledge] = useState([]);
//   const [selectedDomainKnowledge, setSelectedDomainKnowledge] = useState([]);
//   const [selectedKeywords, setSelectedKeywords] = useState([]);
//   const [focusedField, setFocusedField] = useState(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false); // State for success popup
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     userId: '',
//     name: '',
//     dateOfBirth: '',
//     totalExperience: '',
//     expectedSalary: '',
//     techKnowledge: [],
//     domainKnowledge: [],
//     keywords: [],
//     briefDescription: '',
//     isApproved: false,
//   });

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/countries/');
//         setCountries(response.data);
//       } catch (error) {
//         console.error('Error fetching countries', error);
//       }
//     };

//     const fetchTechKnowledgeOptions = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/tech-knowledge-options/');
//         setTechKnowledgeOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching tech knowledge options', error);
//       }
//     };

//     const fetchDomainKnowledgeOptions = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/domain-knowledge-options/');
//         setDomainKnowledgeOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching domain knowledge options', error);
//       }
//     };

//     const fetchKeywordOptions = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/keyword-options/');
//         setKeywordOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching keyword options', error);
//       }
//     };

//     fetchCountries();
//     fetchTechKnowledgeOptions();
//     fetchDomainKnowledgeOptions();
//     fetchKeywordOptions();
//   }, []);

//   const fetchStates = async (countryName) => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/countries/${countryName}/states/`);
//       setStates(response.data);
//     } catch (error) {
//       console.error('Error fetching states', error);
//     }
//   };

//   const fetchCities = async (stateName) => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/states/${stateName}/cities/`);
//       setCities(response.data);
//     } catch (error) {
//       console.error('Error fetching cities', error);
//     }
//   };

//   const handleFileChange = (event) => {
//     const { name, files } = event.target;
//     if (name === 'resumeFile') {
//       const file = files[0];
//       if (file && file.size <= 1048576 && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
//         setResumeFile(file);
//       } else {
//         setResumeFile(null);
//         alert('Resume must be a .doc or .docx file and less than 1 MB');
//       }
//     } else if (name === 'pictureFile') {
//       const file = files[0];
//       if (file && file.size <= 102400 && file.type === 'image/jpeg') {
//         setPictureFile(file);
//       } else {
//         setPictureFile(null);
//         alert('Picture must be a .jpg file and less than 100 KB');
//       }
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleTechKnowledgeSelect = (options) => {
//     const selectedValues = options.map(option => option.value);
//     setSelectedTechKnowledge(options);
//     setFormData({
//       ...formData,
//       techKnowledge: selectedValues,
//     });
//   };

//   const handleDomainKnowledgeSelect = (options) => {
//     const selectedValues = options.map(option => option.value);
//     setSelectedDomainKnowledge(options);
//     setFormData({
//       ...formData,
//       domainKnowledge: selectedValues,
//     });
//   };

//   const handleKeywordSelect = (options) => {
//     const selectedValues = options.map(option => option.value);
//     setSelectedKeywords(options);
//     setFormData({
//       ...formData,
//       keywords: selectedValues,
//     });
//   };

//   const handleFocus = (field) => {
//     setFocusedField(field);
//   };

//   const handleBlur = () => {
//     setFocusedField(null);
//   };
  

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData();
//     const resumeId = uuidv4();

//     data.append('resumeId', resumeId);
//     data.append('resumeFile', resumeFile);
//     data.append('pictureFile', pictureFile);
//     data.append('country', selectedCountry);
//     data.append('state', selectedState);
//     data.append('city', selectedCity);
//     data.append('modified_by', Cookies.get('userId'));

//     Object.keys(formData).forEach((key) => {
//       if (Array.isArray(formData[key])) {
//         data.append(key, JSON.stringify(formData[key]));
//       } else {
//         data.append(key, formData[key]);
//       }
//     });

//     try {
//       const accessToken = Cookies.get('accessToken');
//       const response = await axios.post('http://127.0.0.1:8000/resume/', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${accessToken}`
//         },
//       });
//       console.log('File successfully uploaded', response.data);
//       setSubmitSuccess(true);
//     } catch (error) {
//       console.error('Error uploading file', error);
//     }
//   };

//   useEffect(() => {
//     if (submitSuccess) {
//       const timer = setTimeout(() => {
//         setSubmitSuccess(false);
//         navigate('/resumes');
//       }, 3000); // Redirect after 3 seconds
//       return () => clearTimeout(timer);
//     }
//   }, [submitSuccess, navigate]);

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Upload Your Resume and Picture</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Resume File (Max 1 MB, .doc, .docx)</label>
//           <input
//             type="file"
//             name="resumeFile"
//             onChange={handleFileChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Picture File (Max 100 KB, .jpg)</label>
//           <input
//             type="file"
//             name="pictureFile"
//             onChange={handleFileChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-gray-700">Country</label>
//             <select
//               value={selectedCountry}
//               onChange={(e) => {
//                 setSelectedCountry(e.target.value);
//                 fetchStates(e.target.value);
//               }}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             >
//               <option value="">Select a country</option>
//               {countries.map((country) => (
//                 <option key={country.id} value={country.name}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>
//           </div>
                
//           <div>
//             <label className="block text-sm font-medium text-gray-700">State</label>
//             <select
//               value={selectedState}
//               onChange={(e) => {
//                 setSelectedState(e.target.value);
//                 fetchCities(e.target.value);
//               }}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             >
//               <option value="">Select a state</option>
//               {states.map((state) => (
//                 <option key={state.id} value={state.name}>
//                   {state.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">City</label>
//             <select
//               value={selectedCity}
//               onChange={(e) => setSelectedCity(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             >
//               <option value="">Select a city</option>
//               {cities.map((city) => (
//                 <option key={city.id} value={city.name}>
//                   {city.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">User ID</label>
//             <input
//               type="text"
//               name="userId"
//               placeholder="User ID"
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Total Experience</label>
//             <input
//               type="number"
//               name="totalExperience"
//               placeholder="Total Experience"
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
//             <input
//               type="number"
//               name="expectedSalary"
//               placeholder="Expected Salary"
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
//             />
//           </div>
//         <div>
//           <KnowledgeInput
//             label="Tech Knowledge"
//             options={techKnowledgeOptions}
//             selectedOptions={selectedTechKnowledge}
//             onSelect={handleTechKnowledgeSelect}
//             onFocus={() => handleFocus('techKnowledge')}
//             onBlur={handleBlur}
//           />
//         </div>
//         <div>
//           <KnowledgeInput
//             label="Domain Knowledge"
//             options={domainKnowledgeOptions}
//             selectedOptions={selectedDomainKnowledge}
//             onSelect={handleDomainKnowledgeSelect}
//             onFocus={() => handleFocus('domainKnowledge')}
//             onBlur={handleBlur}
//           />
//         </div>
//         <div>
//           <KnowledgeInput
//             label="Keywords"
//             options={keywordOptions}
//             selectedOptions={selectedKeywords}
//             onSelect={handleKeywordSelect}
//             onFocus={() => handleFocus('keywords')}
//             onBlur={handleBlur}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Brief Description</label>
//           <ReactQuill
//             theme="snow"
//             value={formData.briefDescription}
//             onChange={(value) => setFormData({ ...formData, briefDescription: value })}
//             className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Upload Files
//         </button>
//       </form>
//       {submitSuccess && (
//         <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-md shadow-md">
//             <p className="text-green-500 text-lg font-semibold">Form submitted successfully!</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import KnowledgeInput from './KnowledgeInput';
import Cookies from 'js-cookie';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [techKnowledgeOptions, setTechKnowledgeOptions] = useState([]);
  const [domainKnowledgeOptions, setDomainKnowledgeOptions] = useState([]);
  const [keywordOptions, setKeywordOptions] = useState([]);
  const [selectedTechKnowledge, setSelectedTechKnowledge] = useState([]);
  const [selectedDomainKnowledge, setSelectedDomainKnowledge] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false); // State for success popup
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    dateOfBirth: '',
    totalExperience: '',
    expectedSalary: '',
    techKnowledge: [],
    domainKnowledge: [],
    keywords: [],
    briefDescription: '',
    isApproved: false,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/countries/');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries', error);
      }
    };

    const fetchTechKnowledgeOptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/tech-knowledge-options/');
        setTechKnowledgeOptions(response.data);
      } catch (error) {
        console.error('Error fetching tech knowledge options', error);
      }
    };

    const fetchDomainKnowledgeOptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/domain-knowledge-options/');
        setDomainKnowledgeOptions(response.data);
      } catch (error) {
        console.error('Error fetching domain knowledge options', error);
      }
    };

    const fetchKeywordOptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/keyword-options/');
        setKeywordOptions(response.data);
      } catch (error) {
        console.error('Error fetching keyword options', error);
      }
    };

    fetchCountries();
    fetchTechKnowledgeOptions();
    fetchDomainKnowledgeOptions();
    fetchKeywordOptions();
  }, []);

  const fetchStates = async (countryName) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/countries/${countryName}/states/`);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states', error);
    }
  };

  const fetchCities = async (stateName) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/states/${stateName}/cities/`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities', error);
    }
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'resumeFile') {
      const file = files[0];
      if (file && file.size <= 1048576 && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        setResumeFile(file);
      } else {
        setResumeFile(null);
        alert('Resume must be a .doc or .docx file and less than 1 MB');
      }
    } else if (name === 'pictureFile') {
      const file = files[0];
      if (file && file.size <= 102400 && file.type === 'image/jpeg') {
        setPictureFile(file);
      } else {
        setPictureFile(null);
        alert('Picture must be a .jpg file and less than 100 KB');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Date validation logic
    if (name === 'dateOfBirth') {
      const selectedDate = new Date(value);
      const earliestDate = new Date('1900-01-01');
      const today = new Date();

      if (selectedDate < earliestDate || selectedDate > today) {
        alert('Date of birth must be between 1900 and today.');
        setFormData({
          ...formData,
          dateOfBirth: '',
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTechKnowledgeSelect = (options) => {
    const selectedValues = options.map(option => option.value);
    setSelectedTechKnowledge(options);
    setFormData({
      ...formData,
      techKnowledge: selectedValues,
    });
  };

  const handleDomainKnowledgeSelect = (options) => {
    const selectedValues = options.map(option => option.value);
    setSelectedDomainKnowledge(options);
    setFormData({
      ...formData,
      domainKnowledge: selectedValues,
    });
  };

  const handleKeywordSelect = (options) => {
    const selectedValues = options.map(option => option.value);
    setSelectedKeywords(options);
    setFormData({
      ...formData,
      keywords: selectedValues,
    });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    const resumeId = uuidv4();

    data.append('resumeId', resumeId);
    data.append('resumeFile', resumeFile);
    data.append('pictureFile', pictureFile);
    data.append('country', selectedCountry);
    data.append('state', selectedState);
    data.append('city', selectedCity);
    data.append('modified_by', Cookies.get('userId'));

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.post('http://127.0.0.1:8000/resume/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        },
      });
      console.log('File successfully uploaded', response.data);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        navigate('/resumes');
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, navigate]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume and Picture</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Resume File (Max 1 MB, .doc, .docx)</label>
          <input
            type="file"
            name="resumeFile"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Picture File (Max 100 KB, .jpg)</label>
          <input
            type="file"
            name="pictureFile"
            onChange={handleFileChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                fetchStates(e.target.value);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
                
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                fetchCities(e.target.value);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              name="userId"
              placeholder="User ID"
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Experience</label>
            <input
              type="number"
              name="totalExperience"
              placeholder="Total Experience"
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
            <input
              type="number"
              name="expectedSalary"
              placeholder="Expected Salary"
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        <div>
          <KnowledgeInput
            label="Tech Knowledge"
            options={techKnowledgeOptions}
            selectedOptions={selectedTechKnowledge}
            onSelect={handleTechKnowledgeSelect}
            onFocus={() => handleFocus('techKnowledge')}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <KnowledgeInput
            label="Domain Knowledge"
            options={domainKnowledgeOptions}
            selectedOptions={selectedDomainKnowledge}
            onSelect={handleDomainKnowledgeSelect}
            onFocus={() => handleFocus('domainKnowledge')}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <KnowledgeInput
            label="Keywords"
            options={keywordOptions}
            selectedOptions={selectedKeywords}
            onSelect={handleKeywordSelect}
            onFocus={() => handleFocus('keywords')}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Brief Description</label>
          <ReactQuill
            theme="snow"
            value={formData.briefDescription}
            onChange={(value) => setFormData({ ...formData, briefDescription: value })}
            className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload Files
        </button>
      </form>
      {submitSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-green-500 text-lg font-semibold">Form submitted successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
