import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import defaultProfilePicture from "../img/user(1).png";
import BigSphere from "../img/globe(1).png";
import PasswordStrengthBar from 'react-password-strength-bar'; // Import PasswordStrengthBar component
import thumbsUp from "../img/dislike(2).png"
import thumbsDown from "../img/dislike(1).png"
import TopNavbar from '../components/TopNavbar';

const Settings = () => {

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext)
  const userId = currentUser._id;

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/user/${userId}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToUpdateProfile = () => {
    navigate(`/UpdateUserProfile`);
  };

  const navigateToUpdateEmail = () => {
    navigate(`/UpdateEmail`);
  };

  const navigateToChangePassword = () => {
    navigate(`/ChangePassword`);
  };

  return (
    <div>
      <TopNavbar />
      <div className='settings-container'>
        <div className='settings-nav'>
          <span className='settings-logo'>Settings</span>
          <button onClick={navigateToUpdateProfile}>Update User Profile</button>
          <button onClick={navigateToUpdateEmail}>Update Email</button>
          <button onClick={navigateToChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
