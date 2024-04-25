import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
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
  const [userRole, setUserRole] = useState(currentUser.role);
  const [users, setUsers] = useState('');
  const [refreshData, setRefreshData] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const [showToken, setShowToken] = useState('')
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
  const [cohorts, setCohorts] = useState([]);

  console.log(cohorts);

  useEffect(() => {
    // Fetch cohorts data
    const fetchCohorts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/cohorts");
        setCohorts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCohorts();
  }, [refreshData]);

  useEffect(() => {
    // Fetch users data
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [refreshData]);

  const resetTheData = () => {
    setRefreshData(refreshData + 1);
  };

  console.log(refreshData);

  return (
    <div>
      <TopNavbar />
      <div className="home-container">
        {userRole === "SuperAdmin" && (
          <div className='home'>
            {userRole === 'SuperAdmin' ? <AdminNavBar /> : null}
            <div className="home-body">
              <Navbar />
              {userRole === 'SuperAdmin' && (
                <button onClick={resetTheData} type="button" className="btn btn-primary" style={{ borderRadius: "0px", backgroundColor: "#0077B6", border: "none" }}>Refresh Data</button>
              )}
              <Outlet context={[users, refreshData, cohorts]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
