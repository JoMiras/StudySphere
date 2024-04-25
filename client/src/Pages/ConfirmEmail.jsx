import React, { useContext } from 'react';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import TopNavbar from "../components/TopNavbar";

const ConfirmEmail = () => {
    const { currentUser } = useContext(AuthContext); // Moved inside the component
    const userId = currentUser._id;
    const navigate = useNavigate();

    const getCurrentUser = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/user/${userId}`);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const navigateToSettings = () => {
        navigate(`/Settings`);
    };

    return (
        <div className="settings-container">
            <TopNavbar />
            <div className="settingsFormContainer">
                <div className="formWrapper">
                    <h1>Email verification sent</h1>
                    <h2>
                        A confirmation email has been sent to your new email address.
                        <br></br>Please check your inbox and click the confirmation link
                    </h2>
                    <h3>to be redirected to the settings page</h3>
                    <button onClick={navigateToSettings}>Click here</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;
