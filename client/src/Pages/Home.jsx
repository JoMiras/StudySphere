// Home.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios'
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import AdminNavBar from '../components/AdminNavbar';
import { Outlet } from 'react-router-dom';
import UserModal from '../components/userModal';
import TopNavbar from '../components/TopNavbar';


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
  const navigate = useNavigate();
  const { currentUser, setIsLoggedIn, setCurrentUser } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(currentUser.role)
  const [users, setUsers] = useState('');
  const [refreshData, setRefreshData] = useState(0)

  const logout = () => {
    console.log("logged out")
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser')
    console.log('Logged out successfully!')
  };
  console.log(userRole);

  const[showToken, setShowToken] = useState('')
  const test = async () => {
    await checkAndRenewToken();
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await axios.get('http://localhost:3000/test', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(res.data)
      setShowToken(accessToken)
    } catch (error) {
      console.error(error);
    }
  };

  const newCohort = async () => {
    navigate("/newCohort");
  }
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    // Fetch data initially
    fetchData();
  }, [refreshData]);
  
  
const resetTheData = () => {
  setRefreshData(refreshData + 1)
}

  console.log(refreshData)


  return (
    <div>
    <TopNavbar />
    <div className="home-container">
      <div className='home'>
        {userRole === 'SuperAdmin' ? <AdminNavBar /> : null}
        <div className="home-body">
          <Navbar />
          <button onClick={resetTheData} type="button" className="btn btn-primary">Refresh Data</button>
          <Outlet context={[users, refreshData]} />
        </div>
      </div>
    {/* <>
    <TopNavbar />
      <h1>
        {currentUser ? `Welcome, ${currentUser.username}` : 'Welcome'}
        {avatar == '' || avatar == null ? "" : <img  width={100} height={100} src={avatar}/>}
      </h1>
      <h3>Role: {currentUser.role}</h3>
      <button className='log-out-btn' onClick={logout}> log out</button>
      <button onClick={test}>test</button>
      <button onClick={newCohort}>New Cohort</button>
      <h3>accessToken: {showToken}</h3>
      <SideNavBar />
      <div>
      <button onClick={openModal}>Open User List Modal</button>
      <UserModal isOpen={isModalOpen} onClose={closeModal} /> */}
    </div>
    </div>
  );
}

export default Home;
