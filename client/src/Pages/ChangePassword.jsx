import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import TopNavbar from '../components/TopNavbar';
import Loading from '../components/Loading';
import SettingsNav from '../components/SettingsNav';

const ChangePassword = () => {
    const [newData, setNewData] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const userId = currentUser._id;

    const onChange = (e) => {
        setNewData({ ...newData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (newData.password !== newData.confirmPassword) {
            setPasswordMatchError(true);
            return; // Stop execution if passwords don't match
        }

        setIsLoading(true);
        setPasswordMatchError(false);

        try {
            // Verify the current password
            const verifyRes = await axios.post('http://localhost:4000/verify-password', { userId, password: newData.currentPassword });
            if (verifyRes.data.message !== 'Password is correct') {
                console.error('Incorrect current password');
                return; // Stop execution if current password is incorrect
            }

            // If current password is correct, proceed with the update
            const res = await axios.post('http://localhost:4000/update-password', { userId, password: newData.password });
            console.log(res.data); // Handle successful password update
            navigate("/Settings"); // Redirect to settings page after successful password update
        } catch (err) {
            console.error('Password update error:', err.response.data);
            // Optionally, show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='settings-container'>
            <TopNavbar />
            {isLoading ? (
                <div className='loading-login'>
                    <Loading />
                    <p style={{ color: '#023E8A', fontWeight: 'bold', }}>Updating your password...</p>
                </div>
            ) : (
                <div className='settings-container-content'>
                    <SettingsNav />
                    <div className='settingsFormContainer'>
                        <div className='formWrapper'>
                            <span className='settings-logo'>Change Password</span>
                            <form onSubmit={e => onSubmit(e)}>
                                <div className="inputWrapper">
                                    <input type="password" id="currentPassword" name="currentPassword" value={newData.currentPassword} onChange={onChange} required placeholder='Current Password' />
                                </div>
                                <div className="inputWrapper">
                                    <input type="password" id="password" name="password" value={newData.password} onChange={onChange} minLength='6' required placeholder='New Password' />
                                </div>
                                <div className="inputWrapper">
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={newData.confirmPassword} onChange={onChange} minLength='6' required placeholder='Confirm New Password' />
                                </div>
                                {passwordMatchError && <p style={{ color: 'red' }}>Passwords do not match</p>}
                                <button type='submit'>Submit Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangePassword;
