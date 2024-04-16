import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input/input';

const Verify = () => {
 const [verificationCode, setVerificationCode] = useState('');
 const [phoneNumber, setPhoneNumber] = useState('');
 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

 const handlePhoneNumberSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:4000/verify/start', {
        to: phoneNumber,
      });
      console.log('verify/start post request sent');
      setLoading(false);
    } catch (err) {
      console.error('Error sending verification code:', err.response.data);
      setError('Error sending verification code');
      setLoading(false);
    }
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
      <form onSubmit={handlePhoneNumberSubmit}>
        <div className='inputWrapper'>
        <PhoneInput
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
        </div>
        <button type="submit">Submit Phone Number</button>
      </form>
      <form onSubmit={handleVerificationCodeSubmit}>
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

export default Verify;
