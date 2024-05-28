// import React, { useState, useEffect, useRef } from 'react';
// import Globe from "../img/globe (2).png";
// import '../Landing.scss';
// import ParticlesComponent from '../components/particles';
// import Switch from '../components/Switch';

// const Faq = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [visibleAnswerIndex, setVisibleAnswerIndex] = useState(null);
//   const faqRef = useRef(null);

//   const handleMenuToggle = (e) => {
//     e.preventDefault();
//     setIsMenuOpen(!isMenuOpen);
//     setMenuPosition({
//       x: e.clientX,
//       y: e.clientY,
//     });
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const handleQuestionClick = (index) => {
//     setVisibleAnswerIndex(visibleAnswerIndex === index ? null : index);
//   };

//   const handleClickOutside = (event) => {
//     if (faqRef.current && !faqRef.current.contains(event.target)) {
//       setVisibleAnswerIndex(null);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const faqs = [
//     {
//       question: "How do I register for a course?",
//       answer: "To register for a course, navigate to the 'Courses' page and select the course you want to enroll in. Follow the on-screen instructions to complete your registration.",
//     },
//     {
//       question: "What is the refund policy?",
//       answer: "Sphere is currently a free software developed by BVT interns. You should not be prompted to pay.",
//     },
//     {
//       question: "How can I contact my teacher?",
//       answer: "You can contact your teacher through the 'Contact Teacher' option in the 'Navigate' menu or directly from your course dashboard.",
//     },
//     {
//       question: "What if I forget my password?",
//       answer: "Thats a you problem.... If you forget your password, click on the 'Forgot password' link on the login page and follow the instructions to reset your password.",
//     },
//     {
//         question: "How do I view events?",
//         answer: "Events will be visible in your calendar that can be found on your home page.",
//       },
//       {
//         question: "How can I add events to the calendar?",
//         answer: "Currently this feature is reserved solely for teachers and admin",
//       },
//       {
//         question: "Can I change my username, picture, password?",
//         answer: " Yes once you navigate to settings tab you will see an option to do so.",
//       },
//       {
//         question: "I dont like the dark and light themes. Can I create my own?",
//         answer: " This feature will be added soon....",
//       },
//       {
//         question: "I would like to report a teacher",
//         answer: " You can contact admin at oureamil.com Please include your name, teachers name, class name, and a brief description of what you would like to report. If its longer than 10 words we aren't reading it",
//       },
//   ];

//   return (
//     <>    
//       <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
//         <ParticlesComponent id="particles" isDarkMode={isDarkMode} />
//         <header className="lheader">
//           <div className="logo"> <img src={Globe} alt="Globe" /> </div>
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
//               <li><a href="/faq">FAQs</a></li>
//             </ul>
//           </nav>
//           <div className="lsearch">
//             <input type="text" placeholder="Search courses..." />
//             <button>Search</button>
//             <Switch onSwitch={toggleDarkMode} />
//           </div>
//         </header>
//         <section className="faq-section" ref={faqRef}>
//           <h1>Frequently Asked Questions</h1>
//           <div className="faq-list">
//             {faqs.map((faq, index) => (
//               <div 
//                 className={`faq-item ${visibleAnswerIndex === index ? 'active' : ''}`} 
//                 key={index}
//               >
//                 <h3 onClick={() => handleQuestionClick(index)}>{faq.question}</h3>
//                 <p>{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//         <footer className="footer">
//           <p>&copy; 2024 StudySphere. All rights reserved.</p>
//         </footer>
//       </div>
//     </>
//   );
// };

// export default Faq;










import React, { useState, useEffect, useRef } from 'react';
import Globe from "../img/globe(2).png";
import '../Landing.scss';
import ParticlesComponent from '../components/particles';
import Switch from '../components/Switch';

const Faq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('isDarkMode') === 'true';
  });
  
  const [visibleAnswerIndex, setVisibleAnswerIndex] = useState(null);
  const faqRef = useRef(null);
  const popoutMenuRef = useRef(null);

  const handleMenuToggle = (e) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleQuestionClick = (index) => {
    setVisibleAnswerIndex(visibleAnswerIndex === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (
      popoutMenuRef.current &&
      !popoutMenuRef.current.contains(event.target) &&
      !event.target.classList.contains('dropdown-toggle')
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const faqs = [
        {
          question: "How do I register for a course?",
          answer: "To register for a course, navigate to the 'Courses' page and select the course you want to enroll in. Follow the on-screen instructions to complete your registration.",
        },
        {
          question: "What is the refund policy?",
          answer: "Sphere is currently a free software developed by BVT interns. You should not be prompted to pay.",
        },
        {
          question: "How can I contact my teacher?",
          answer: "You can contact your teacher through the 'Contact Teacher' option in the 'Navigate' menu or directly from your course dashboard.",
        },
        {
          question: "What if I forget my password?",
          answer: "Thats a you problem.... If you forget your password, click on the 'Forgot password' link on the login page and follow the instructions to reset your password.",
        },
        {
            question: "How do I view events?",
            answer: "Events will be visible in your calendar that can be found on your home page.",
          },
          {
            question: "How can I add events to the calendar?",
            answer: "Currently this feature is reserved solely for teachers and admin",
          },
          {
            question: "Can I change my username, picture, password?",
            answer: " Yes once you navigate to settings tab you will see an option to do so.",
          },
          {
            question: "I dont like the dark and light themes. Can I create my own?",
            answer: " This feature will be added soon....",
          },
          {
            question: "I would like to report a teacher",
            answer: " You can contact admin at oureamil.com Please include your name, teachers name, class name, and a brief description of what you would like to report. If its longer than 10 words we aren't reading it",
          },
          {
            question: "Who are the six",
            answer:"Brennen Boguder, Jonah Mirasol, Chance Young, Amairany Chavez, Phillip Milton, Luis Gomez",
          },
      ];

  return (
    <>    
      <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
        <ParticlesComponent id="particles" isDarkMode={isDarkMode} />
        <header className="lheader">
          <div className="logo"> <img src={Globe} alt="Globe" /> </div>
          <nav>
            <ul>
              <li><a href="/Landing">Landing</a></li>
              <li><a href="#">Courses</a></li>
              <li onClick={(e) => handleMenuToggle(e)} className="dropdown-toggle">
                Navigate
                {isMenuOpen && (
                  <ul 
                    className="pop-out-menu" 
                    style={{ left: menuPosition.x, top: menuPosition.y }} 
                    ref={popoutMenuRef}
                  >
                    <li><a href="#">Check my Progress</a></li>
                    <li><a href="#">Contact teacher</a></li>
                    <li><a href="login">Logout</a></li>
                  </ul>
                )}
              </li>
              <li><a href="#">Settings</a></li>
            </ul>
          </nav>
          <div className="lsearch">
            <input type="text" placeholder="Search for question" />
            <button>Search</button>
            <Switch onSwitch={toggleDarkMode} />
          </div>
        </header>
        <section className="faq-section" ref={faqRef}>
          <h1>Frequently Asked Questions</h1>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                className={`faq-item ${visibleAnswerIndex === index ? 'active' : ''}`} 
                key={index}
              >
                <h3 onClick={() => handleQuestionClick(index)}>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
        <footer className="footer">
          <p>&copy; 2024 StudySphere. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Faq;
