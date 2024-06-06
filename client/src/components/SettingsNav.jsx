import React from "react";
import { useNavigate } from 'react-router-dom';

const SettingsNav = () => {

    const navigate = useNavigate();

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
        <div className='settings-nav'>
            <button onClick={navigateToUpdateProfile}>Update User Profile</button>
            <button onClick={navigateToUpdateEmail}>Update Contact</button>
            <button onClick={navigateToChangePassword}>Change Password</button>
        </div>
    )
}

export default SettingsNav;