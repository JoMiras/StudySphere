import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import defaultProfilePicture from "../img/user(1).png";
import BigSphere from "../img/globe(1).png";
import PasswordStrengthBar from 'react-password-strength-bar'; // Import PasswordStrengthBar component
import thumbsUp from "../img/dislike(2).png"
import thumbsDown from "../img/dislike(1).png"
import TopNavbar from '../components/TopNavbar';

const Settings = () => {
  const [newData, setNewData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
    role: 'student',
    isEmailConfirmed: true
  });

  const [avatar, setAvatar] = useState('');
  const [userAvailability, setUSerAvailability] = useState(null);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false); // State to track if password strength should be shown
  const navigate = useNavigate();
  const { username, email, phoneNumber, password, confirmPassword, profilePicture } = newData;
  const { currentUser } = useContext(AuthContext)
  const userId = currentUser._id;

  const passwordStrengthStyle = {
    color: "#023E8A",
    fontFamily: "arial",
    fontWeight: "bold",
    fontSize: "20px"
  }

  const onChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
    if (e.target.name === 'password' && e.target.value.trim() !== '') {
      setShowPasswordStrength(true);
    } else {
      setShowPasswordStrength(false);
    }
  };


  const onFileChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setNewData({ ...newData, profilePicture: reader.result });
      setAvatar(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };


  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
    } else {
      try {
        const res = await axios.post('http://localhost:4000/update-user', {userId, newData});
        console.log(res.data); // Handle successful registration
        navigate("/Settings"); // Redirect to login page after successful registration
      } catch (err) {
        console.error('Registration error:', err.response.data);
      }
    }
  };

  const checkUsernameAvailability = async () => {
    console.log(username)
    try {
      const res = await axios.post('http://localhost:4000/checkUsername', { username });
      setUSerAvailability(res.data)
    } catch (error) {
      console.error(error)
    }
  };


  useEffect(() => {
    if (username === '') {
      setUSerAvailability(null)
    } else {
      checkUsernameAvailability();
    }
  }, [username]);





  return (
    <div className='settings-container'>
          <TopNavbar />
      <div className='formContainer'>
        <div className='formWrapper'>
          <span className='logo'>Settings</span>
          <form onSubmit={e => onSubmit(e)}>
            <div className="inputWrapper username-wrapper">
              <input type="text" id="userName" name="username" value={username} onChange={e => onChange(e)} placeholder='Username' />
              {userAvailability === true && <img className="thumbs-up" src={thumbsUp} />}
              {userAvailability === false && <img className="thumbs-down" src={thumbsDown} />}
            </div>
            <div className="inputWrapper username-wrapper">
              <input type="email" id="email" name="email" value={email} onChange={e => onChange(e)} placeholder='Email' />
            </div>
            <div className="inputWrapper">
              <input type="tel" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={e => onChange(e)} placeholder='Phone Number' />
            </div>
            <div className="inputWrapper">
              <input type="password" id="password" name="password" value={password} onChange={e => onChange(e)} minLength='6' required placeholder='Password' />
            </div>
            {showPasswordStrength && <PasswordStrengthBar
              password={password}
              scoreWordStyle={passwordStrengthStyle}
            />}
            <div className="inputWrapper">
              <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={e => onChange(e)} minLength='6' required placeholder='Confirm Password' />
            </div>
            <div className='avatar-container'>
              <label htmlFor='file' className='avatar-input'>
                {avatar == '' || avatar == null ? <img className="selected-avatar-image" width={100} height={100} src={defaultProfilePicture} /> : <img className="selected-avatar-image" width={100} height={100} src={avatar} />}
                <input
                  type="file"
                  id="file"
                  name="profilePicture"
                  onChange={onFileChange}
                  style={{ display: 'none', cursor: 'pointer' }}
                />
              </label>
            </div>
            <button type='submit'>Submit Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
