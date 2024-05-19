import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AdminNavBar from '../components/AdminNavbar';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import { useSocket } from '../context/socketContext';

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState('');
  const [refreshData, setRefreshData] = useState(0);
  const [cohorts, setCohorts] = useState([]);
  const socket = useSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        setMessages((prevData) => [...prevData, data]);
      });

      // Register user
      const userId = currentUser._id; // Replace with actual user ID
      socket.emit('register', userId);

      // Clean up the socket connection when the component unmounts
      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

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

  return (
    <div className="home-container">
      <div className='home'>
        {currentUser.role === "SuperAdmin" && <AdminNavBar />}
        {currentUser.role === "student" && <UserNavbar />}
        <div className="home-body">
          <Navbar />
          <Outlet context={[users, setRefreshData, cohorts, messages]} />
        </div>
      </div>
    </div>
  );
}

export default Home;
