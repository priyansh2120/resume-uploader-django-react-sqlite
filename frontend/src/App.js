import './App.css';
import AdminPage from './pages/AdminPage';
import FileUpload from './components/FileUpload';
import ListingScreen from './pages/ListingScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ViewResumeScreen from './pages/ViewResumeScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resumes" element={<ListingScreen />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/view-resume/:resumeId" element={<ViewResumeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
