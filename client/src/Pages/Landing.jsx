// import React, { useState, useEffect } from 'react';
// import Globe from "../img/globe (2).png";
// import '../Landing.scss';
// import ParticlesComponent from '../components/particles';
// import teacher from "../img/teacher.png";
// import student from "../img/reading.png";
// import cohort from "../img/teamwork.png";
// import axios from 'axios';

// import Switch from '../components/Switch';

// const LandingPage = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
//   const [cohorts, setCohorts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   const students = users ? users.filter(user => user.role === "student") : [];
//   const teachers = users ? users.filter(user => user.role === "teacher") : [];

//   const handleMenuToggle = (e) => {
//     e.preventDefault();
//     setIsMenuOpen(!isMenuOpen);
//     setMenuPosition({
//       x: e.clientX,
//       y: e.clientY,
//     });
//   };

//   useEffect(() => {
//     const fetchCohorts = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/cohorts");
//         setCohorts(res.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchCohorts();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/users");
//         setUsers(res.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <>    
//       <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
//         <ParticlesComponent id="particles" isDarkMode={isDarkMode} />
//         <header className="lheader">
//           <div className="logo"> <img src={Globe} alt="Globe"/> </div>
//           <nav>
//             <ul>
//               <li><a href="/home">Home</a></li>
//               <li><a href="#">Courses</a></li>
//               <li onClick={(e) => handleMenuToggle(e)} className="dropdown-toggle">
//                 Navigate
//                 {isMenuOpen && (
//                   <ul className="pop-out-menu" style={{ left: menuPosition.x, top: menuPosition.y }}>
//                     <li><a href="login">Logout</a></li>
//                     <li><a href="#">Check my Progress</a></li>
//                     <li><a href="#">Contact teacher</a></li>
//                   </ul>
//                 )}
//               </li>
//               <li><a href="#">FAQs</a></li>
//             </ul>
//           </nav>
//           <div className="lsearch">
//             <input type="text" placeholder="Search courses..." />
//             <button>Search</button>
//             <Switch onSwitch={toggleDarkMode} />
//           </div>
//         </header>
//         <section className="hero">
//           <div className="hero-content" >
          
//             <h1>Become </h1>
//             <p><strong>Who you dream to be on your own Schedule.</strong></p>
//             <button>Get Started!</button>
//             <button>Our Courses!</button>
//           </div>
//         </section>
//         <section className="features">
//           <h2>Get ready for</h2>
//           <div className="feature-list">
//             <div className="feature-item">
//               <h3>Interactive Learning</h3>
//               <p>Sphere is committed to making learning convenient no matter where you are!</p>
//             </div>
//             <div className="feature-item">
//               <h3>In counting we have </h3>
//               <div className='bottom-portion'>
//                 <div className="statistics">
//                   <div className="info">
//                     <p>{students.length}</p>
//                     <p>Total Students</p>
//                   </div>
//                   <div className="stats-picture">
//                     <img src={student} alt="" />
//                   </div>
//                 </div>
//                 <div className="statistics">
//                   <div className="info">
//                     <p>{cohorts.length}</p>
//                     <p>Total Cohorts</p>
//                   </div>
//                   <div className="stats-picture">
//                     <img src={cohort} alt="" />
//                   </div>
//                 </div>
//                 <div className="statistics">
//                   <div className="info">
//                     <p>{teachers.length}</p>
//                     <p>Total Teachers</p>
//                   </div>
//                   <div className="stats-picture">
//                     <img src={teacher} alt="" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <footer className="footer">
//           <p>&copy; 2024 StudySphere. All rights reserved.</p>
//         </footer>
//       </div>
//     </>
//   );
// };

// export default LandingPage;








import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from "../img/globe(2).png";
import '../Landing.scss';
import ParticlesComponent from '../components/particles';
import teacher from "../img/teacher.png";
import student from "../img/reading.png";
import cohort from "../img/teamwork.png";
import axios from 'axios';
import Switch from '../components/Switch';
import { AuthContext } from '../context/authContext';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [cohorts, setCohorts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });
  
  
  const { setIsLoggedIn, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuRef = useRef(null); 

  const students = users ? users.filter(user => user.role === "student") : [];
  const teachers = users ? users.filter(user => user.role === "teacher") : [];

  const handleMenuToggle = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/cohorts");
        setCohorts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCohorts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Remove event listener when component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
   
    setIsLoggedIn(false);
    setCurrentUser(null);

    
    navigate('/');
  };

  const handleClickOutside = (event) => {
    
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      
      setIsMenuOpen(false);
    }
  };

  return (
    <>    
      <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
        <ParticlesComponent id="particles" isDarkMode={isDarkMode} />
        <header className="lheader">
          <div className="logo"> <img src={Globe} alt="Globe" /> </div>
          <nav>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="#">Courses</a></li>
              <li onClick={(e) => handleMenuToggle(e)} className="dropdown-toggle">
                Navigate
                {isMenuOpen && (
                  <ul ref={menuRef} className="pop-out-menu" style={{ left: menuPosition.x, top: menuPosition.y }}>
                    <li onClick={handleLogout}><a href="#">Logout</a></li>
                    <li><a href="#">Check my Progress</a></li>
                    <li><a href="#">Contact teacher</a></li>
                  </ul>
                )}
              </li>
              <li><a href="#">Settings</a></li>
              <li><a href="faq">FAQs</a></li>
            </ul>
          </nav>
          <div className="lsearch">
            <input type="text" placeholder="Search courses..." />
            <button>Search</button>
            <Switch onSwitch={toggleDarkMode} />
          </div>
        </header>
        <section className="hero">
          <div className="hero-content">
            <h1 className='Become'>Become </h1>
            <p><strong>Who you dream to be on your own Schedule.</strong></p>
            <button>Get Started!</button>
            <button>Our Courses!</button>
          </div>
        </section>
        <section className="features">
          <h2>Get ready for</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>Interactive Learning</h3>
              <p>Sphere is committed to making learning convenient no matter where you are!</p>
            </div>
            <div className="feature-item">
              <h3>In counting we have </h3>
              <div className='bottom-portion'>
                <div className="statistics">
                  <div className="info">
                    <p>{students.length}</p>
                    <p>Total Students</p>
                  </div>
                  <div className="stats-picture">
                    <img src={student} alt="" />
                  </div>
                </div>
                <div className="statistics">
                  <div className="info">
                    <p>{cohorts.length}</p>
                    <p>Total Cohorts</p>
                  </div>
                  <div className="stats-picture">
                    <img src={cohort} alt="" />
                  </div>
                </div>
                <div className="statistics">
                  <div className="info">
                    <p>{teachers.length}</p>
                    <p>Total Teachers</p>
                  </div>
                  <div className="stats-picture">
                    <img src={teacher} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="footer">
          <p>&copy; 2024 StudySphere. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
