// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import emailjs from 'emailjs-com';
// import '../404Page.scss';
// import '../Landing.scss';
// import Globe from "../img/globe(2).png";
// import ParticlespnfComponent from '../components/particlespnf';
// import Switch from '../components/Switch';

// const PageNotFound = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [email, setEmail] = useState('');
//   const [description, setDescription] = useState('');
//   const [message, setMessage] = useState('');

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     const templateParams = {
//       user_email: email,
//       description: description,
//     };

//     emailjs.send('service_2p0f2a9', 'template_gvu95ps', templateParams, 'bWrT4Ko6dE5BD0B9u')
//       .then((response) => {
//         console.log('Email sent successfully!', response.status, response.text);
//         setMessage('Error report sent successfully!');
//         setEmail('');
//         setDescription('');
//       })
//       .catch((error) => {
//         console.log('Failed to send email:', error);
//         setMessage('Failed to send error report. Please try again later.');
//       });
//   };

//   return (
//     <>    
//       <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
//         <ParticlespnfComponent id="particles" isDarkMode={isDarkMode} />
//         <header className="lheader">
//           <div className="logo"><img src={Globe} alt="Globe" /></div>
//           <nav>
//             <ul>
//               <li><Link to="/">Return Home</Link></li>
//               <li><Link to="/logout">Logout</Link></li>
//             </ul>
//           </nav>
//           <div className="lsearch">
//             <Switch onSwitch={toggleDarkMode} />
//           </div>
//         </header>
//         <h1 className='pnfh'>404 - Page Not Found</h1>
//         <h2 className='sorry'>Oops!</h2>
//         <p>Sorry, the page you are looking for does not exist.</p>

//         <div className="sphere"><img src={Globe} alt="Globe" width="100" height="100" /></div>

//         <div className="error-report">
//           <h3>Report this error</h3>
//           <form onSubmit={handleFormSubmit}>
//             <label>
//               Your Email:
//               <input 
//                 type="email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 required 
//               />
//             </label>
//             <label>
//               Description:
//               <textarea 
//                 value={description} 
//                 onChange={(e) => setDescription(e.target.value)} 
//                 required 
//               />
//             </label>
//             <button type="submit">Send Report</button>
//           </form>
//           {message && <p>{message}</p>}
//         </div>

//         <footer className="footer">
//           <p>&copy; 2024 StudySphere. All rights reserved.</p>
//         </footer>
//       </div>
//     </>
//   );
// };

// export default PageNotFound;



// remember to add variables before pushing



import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import '../404Page.scss';
import '../Landing.scss';
import Globe from "../img/globe(2).png";
import ParticlespnfComponent from '../components/particlespnf';
import Switch from '../components/Switch';
import { AuthContext } from '../context/authContext'; 

const PageNotFound = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize isDarkMode state based on the value stored in localStorage or default to false (light mode)
    return localStorage.getItem('isDarkMode') === 'true';
  });
  
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // Access setIsLoggedIn and setCurrentUser from the AuthContext
  const { setIsLoggedIn, setCurrentUser } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear authentication tokens and user info 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    // Update context to reflect that the user is no longer logged in
    setIsLoggedIn(false);
    setCurrentUser(null);

    // Redirect to the login page
    window.location.href = '/'; 
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      user_email: email,
      description: description,
    };

    emailjs.send('service_2p0f2a9', 'template_gvu95ps', templateParams, 'bWrT4Ko6dE5BD0B9u')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        setMessage('Error report sent successfully!');
        setEmail('');
        setDescription('');
      })
      .catch((error) => {
        console.log('Failed to send email:', error);
        setMessage('Failed to send error report. Please try again later.');
      });
  };

  return (
    <>    
      <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
        <ParticlespnfComponent id="particles" isDarkMode={isDarkMode} />
        <header className="lheader">
          <div className="logo"><img src={Globe} alt="Globe" /></div>
          <nav>
            <ul>
              <li><Link to="/landing">Landing</Link></li>
              <li onClick={handleLogout}><a href="#">Logout</a></li>
            </ul>
          </nav>
          <div className="lsearch">
            <Switch onSwitch={toggleDarkMode} />
          </div>
        </header>
        <h1 className='pnfh'>404 - Page Not Found</h1>
        <h2 className='sorry'>Oops!</h2>
        <p>Sorry, the page you are looking for does not exist.</p>

        <div className="sphere"><img src={Globe} alt="Globe" width="100" height="100" /></div>

        <div className="error-report">
          <h3>Report this error</h3>
          <form onSubmit={handleFormSubmit} className="error-report-form">
            <label>
              Your Email:
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </label>
            <label>
              Description:
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </label>
            <button type="submit">Send Report</button>
            {message && <p>{message}</p>}
          </form>
        </div>

        <footer className="footer">
          <p>&copy; 2024 StudySphere. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default PageNotFound;
