import React from 'react'; // Make sure to import React
import { useNavigate } from 'react-router-dom';

const TopNavbar = () => { // Corrected the component name
 const navigate = useNavigate(); // Hook for navigation
  
 const settingsPage = async () => {
    navigate("/Settings");
 }
 
 const Home = async () => {
  navigate("/Home");
 }

 return (
    <div className="top-navbar">
      <div className="logo">Study Sphere</div>
      <div className="spacer"></div>
        <div className='nav-buttons'> 
        <button onClick={Home}>Home</button>
        <button onClick={settingsPage}>Settings</button>
        </div>
    </div>

 );
}

export default TopNavbar; // Export the component so it can be used elsewhere
