import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneNumberContext from '../context/phoneNumberContext';
import PhoneInput from 'react-phone-number-input/input';

const Verify = () => {
//  const [verificationCode, setVerificationCode] = useState('');
//  const [phoneNumber, setPhoneNumber] = useState('');
 const { phoneNumber, setPhoneNumber } = useContext(PhoneNumberContext);
 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 const handlePhoneNumberSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError(null);
  let retries = 3;
  let delay = 1000; // Start with a 1-second delay
 
  while (retries > 0) {
     try {
       const res = await axios.post('http://localhost:4000/verify/start', {
         to: phoneNumber,
       });
       console.log('verify/start post request sent');
       setLoading(false);
       navigate("/SubmitVerify");
     } catch (err) {
       if (err.response && err.response.status === 429) { // Check for rate limiting error
         console.error('Rate limit exceeded, retrying...');
         retries--;
         await new Promise(resolve => setTimeout(resolve, delay));
         delay *= 2; // Double the delay for the next retry
       } else {
         console.error('Error sending verification code:', err.response.data);
         setError('Error sending verification code');
         setLoading(false);
         return; // Exit the function if it's a different error
       }
     }
  }
 
  // If all retries fail, set an error message
  setError('Failed to send verification code after multiple attempts. Please try again later.');
  setLoading(false);
 };

 return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <h2>2 Factor Authentication</h2>
        <h3>Please enter your phone number to receive a one time passcode</h3>
      <form onSubmit={handlePhoneNumberSubmit}>
        <div className='inputWrapper'>
        <PhoneInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
        </div>
        <button type="submit">Submit Phone Number</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      </div>
    </div>
 );
};

export default Verify;
