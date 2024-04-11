

import React from 'react';
import { useNavigate } from 'react-router-dom';

function TopNavBar() {
  return (
    <div className="top-navbar">
      <div className="logo">Student Name?</div>
      <div className="spacer"></div>
      <div className="settings">Settings</div>
    </div>
  );
}


function SideNavBar() {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Navigate to the login page when logout button is clicked
    navigate('/login');
  };

  return (
    <div className="side-navbar">
      <div className="course-title">Course 5</div>
      <ul>
        <li>Cards</li>
        <li>Vocab</li>
        <li>Videos</li>
      </ul>
      <button className="logout" onClick={handleLogout}>Logout</button>
    </div>
  );
}

function Home() {
  return (
    <div>
      <TopNavBar />
      <SideNavBar />
    </div>
  );
}

export default Home;
