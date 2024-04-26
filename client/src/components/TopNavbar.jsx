import React, {useContext} from 'react'; // Make sure to import React
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';


const TopNavbar = () => { // Corrected the component name
 const navigate = useNavigate(); // Hook for navigation
  
 const settingsPage = async () => {
    navigate("/Settings");
 }
 
 const Home = async () => {
  navigate("/Home");
 }
 const { currentUser, setIsLoggedIn, setCurrentUser } = useContext(AuthContext);


 const logout = () => {
   console.log("logged out")
   setIsLoggedIn(false);
   setCurrentUser(null);
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
   localStorage.removeItem('currentUser')
   console.log('Logged out successfully!')
 };

 return (
    <div className="top-navbar">
      <div className="logo">Study Sphere</div>
      <div className="spacer"></div>
        <div className='nav-buttons'> 
        <button onClick={Home}>Home</button>
        <button onClick={settingsPage}>Settings</button>
        <button className='log-out-btn' onClick={logout}> log out</button>
        </div>
    </div>

 );
}

export default TopNavbar; // Export the component so it can be used elsewhere
