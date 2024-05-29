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
import Loading from '../components/Loading';
import SettingsNav from '../components/SettingsNav';

const UpdateUserProfile = () => {
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
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);
    const navigate = useNavigate();
    const { username, email, phoneNumber, password, confirmPassword, profilePicture } = newData;
    const { currentUser } = useContext(AuthContext)
    const userId = currentUser._id;
    const [userStartedTyping, setUserStartedTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);

        try {
            // Verify the current password
            const verifyRes = await axios.post('http://localhost:4000/verify-password', { userId, password });
            if (verifyRes.data.message !== 'Password is correct') {
                console.error('Incorrect password');
                setIsLoading(false);
                return; // Stop execution if password is incorrect
            }

            // If password is correct, proceed with the update
            const res = await axios.post('http://localhost:4000/update-user', { userId, newData });
            console.log(res.data); // Handle successful registration
            navigate("/Settings"); // Redirect to login page after successful registration
        } catch (err) {
            console.error('Registration error:', err.response.data);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (username === '' || !userStartedTyping) {
            setUSerAvailability(null);
            return; // Exit if username is empty or the user hasn't started typing
        }

        const checkUsernameAvailability = async () => {
            try {
                const res = await axios.post('http://localhost:4000/checkUsername', { username });
                setUSerAvailability(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        checkUsernameAvailability();
    }, [username, userStartedTyping]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Set loading to false after a delay
        }, 1000); // Adjust the delay as needed

        return () => clearTimeout(timer); // Cleanup on component unmount
    }, [navigate]); // Depend on navigate to trigger loading on page change

    return (
        <div className='settings-container'>
            <TopNavbar />
            {isLoading ? (
                 <div className='loading-login'>
                 <Loading />
                 <p style={{color:'#023E8A', fontWeight:'bold',}}>Updating your profile...</p>
               </div>
            ) : (
            <div className='settings-container-content'>
               <SettingsNav />
                <div className='settingsFormContainer'>
                    <div className='formWrapper'>
                        <span className='settings-logo'>Update your profile</span>
                        <form onSubmit={e => onSubmit(e)}>
                            <div className="inputWrapper username-wrapper">
                                <label htmlFor="userName">Change Username</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="username"
                                    value={username}
                                    onChange={e => onChange(e)}
                                    placeholder='Username'
                                />
                                {userAvailability === true && <img className="thumbs-up" src={thumbsUp} alt="Username available" />}
                                {userAvailability === false && <img className="thumbs-down" src={thumbsDown} alt="Username not available" />}
                            </div>
                            <div className="inputWrapper username-wrapper">
                                <label htmlFor='password'>Enter your password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={e => onChange(e)}
                                    minLength='6'
                                    required placeholder='Current Password' />
                            </div>
                            <div className='avatar-container'>
                                Click to change profile picture
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
            )}
        </div>
    );
};

export default UpdateUserProfile;