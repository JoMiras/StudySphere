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
import SettingsNav from '../components/SettingsNav';

const UpdateEmail = () => {
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
    const [userStartedTyping, setUserStartedTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userId = currentUser._id;
    const [updateType, setUpdateType] = useState('email'); // State to track what the user wants to update

    const getCurrentUser = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/user/${userId}`);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await getCurrentUser();
            if (userInfo) {
                setNewData({
                    username: userInfo.username,
                    email: userInfo.email,
                    phoneNumber: userInfo.phoneNumber,
                    profilePicture: userInfo.profilePicture || defaultProfilePicture,
                    // Keep other fields as they are
                });
                setAvatar(userInfo.profilePicture || defaultProfilePicture);
            }
        };

        fetchUserInfo();
    }, [userId]); // Depend on userId to refetch if it changes

    const onChange = (e) => {
        setNewData({ ...newData, [e.target.name]: e.target.value });
        if (e.target.name === 'username' && e.target.value.trim() !== '') {
            setUserStartedTyping(true); // Set the flag to true when the user starts typing
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
    
        try {
            // Verify the current password
            const verifyRes = await axios.post('http://localhost:4000/verify-password', { userId, password });
            if (verifyRes.data.message !== 'Password is correct') {
                console.error('Incorrect password');
                return; // Stop execution if password is incorrect
            }
    
            // Prepare the new data object based on the update type
            const newData = {
                [updateType]: newData[updateType]
                // Include any other fields you want to update here
            };
    
            // Make a POST request to the /update-user endpoint
            const res = await axios.post('http://localhost:4000/update-user', { userId, newData });
    
            if (res.data === 'A confirmation email has been sent to your new email address. Please check your inbox and click the confirmation link.') {
                console.log('Confirmation email sent. Please check your inbox and click the confirmation link.');
                setIsLoading(true);
                navigate('/ConfirmEmail');
            } else {
                console.error('Failed to initiate email confirmation');
                alert('Failed to initiate email confirmation. Please try again.');
            }
        } catch (err) {
            console.error('Update email error:', err.response.data);
            alert('An error occurred while updating your email. Please try again.');
        }
    };    
    
    return (
        <div className='settings-container'>
            <TopNavbar />
            {isLoading ? (
                <div className='loading-login'>
                    <Loading />
                    <p style={{ color: '#023E8A', fontWeight: 'bold', }}>Updating Email...</p>
                </div>
            ) : (
               <div className='settings-container-content'>
                      <SettingsNav />
                    <div className='settingsFormContainer'>
                        <div className='formWrapper'>
                            <span className='settings-logo'>Update Contact Info</span>
                            <form onSubmit={e => onSubmit(e)}>
                                <div className="inputWrapper username-wrapper">
                                    <label htmlFor="currentEmail">Current Email</label>
                                </div>
                                <div className='setNumberEmail'>{email}</div>
                                <div className="inputWrapper">
                                    <label htmlFor="newEmail">New Email</label>
                                    <input type="email" id="newEmail" name="email" value={newData.email} onChange={e => onChange(e)} placeholder='New Email'/>
                                </div>
                                <div className="inputWrapper">
                                    <label htmlFor="currentPhoneNumber">Current Phone Number</label>
                                    <div className='setNumberEmail'>{phoneNumber}</div>
                                </div>
                                <div className="inputWrapper">
                                    <label htmlFor="newPhoneNumber">New Phone Number</label>
                                    <input type="tel" id="newPhoneNumber" name="phoneNumber" value={newData.phoneNumber} onChange={onChange} placeholder='New Phone Number'/>
                                </div>
                                <div className="inputWrapper">
                                    <label htmlFor='password'>Enter Password</label>
                                    <input type="password" id="password" name="password" value={password} onChange={e => onChange(e)} minLength='6' required placeholder='Current Password' />
                                </div>
                                <button type='submit'>Submit Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default UpdateEmail;
