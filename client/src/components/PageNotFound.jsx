import React from 'react';
import { Link } from 'react-router-dom'; 
import '../404Page.scss'; 

import Globe from "../img/globe(2).png"; 

const PageNotFound = () => {
  return (
    <div className="PageNotF">
      <header className="lheader">
        <div className="logo"> <img src={Globe} alt="Globe"/> </div>
        <nav>
          <ul>
            <li><Link to="/landing">Return to landing</Link></li> 
            <li><a href="#">Contact Us</a></li>
          </ul>
        </nav>
       
      </header>
      
      <div className="error-container">
        <h1 className='pnfh'>404 - Page Not Found</h1>
        <h2 className='sorry'>Oops!</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        
        
        <div className="sphere"> <img src={Globe} alt="Globe" width="100" height="100" /> </div>
        <div>
        <footer className="footer">
        <p>&copy; 2024 StudySphere. All rights reserved.</p>
      </footer>
            </div>
         </div>
            
    </div>
  );
};

export default PageNotFound;
