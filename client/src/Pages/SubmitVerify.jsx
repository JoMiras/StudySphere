import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneNumberContext from '../context/phoneNumberContext';
import PhoneInput from 'react-phone-number-input/input';

const SubmitVerify = () => {
 const [verificationCode, setVerificationCode] = useState('');
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
       return; // Exit the function if the request is successful
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
 

 const handleVerificationCodeSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:4000/verify/check', {
        to: phoneNumber,
        code: verificationCode,
      });
      if (res.data.success) {
        navigate("/home");
      } else {
        setError('Verification failed. Please try again.');
      }
      setLoading(false);
    } catch (err) {
      console.error('Verification error:', err.response.data);
      setError('Verification error');
      setLoading(false);
    }
 };

 return (
    <div className='formContainer'>
      <div className='formWrapper'>
      <form onSubmit={handleVerificationCodeSubmit}>
        <h2>2 Factor Authentication</h2>
        <h3>Check your phone for a 6 digit code</h3>
      <div className='inputWrapper'>
        <input
          type="text"
          value={verificationCode}
          onChange={e => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
        />
        </div>
        <button type="submit">Submit Verification Code</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      </div>
    </div>
 );
};

export default SubmitVerify;
