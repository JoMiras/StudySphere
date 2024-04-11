import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
import { checkAndRenewToken } from '../utilities/checkToken';

const AuthProvider = ({ children }) => {
  const localCurrentUser = localStorage.getItem('currentUser');
  const [currentUser, setCurrentUser] = useState(localCurrentUser ? JSON.parse(localCurrentUser) : null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const localRefreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser !== null) {
        setIsLoggedIn(true);
      } else {
        await checkAndRenewToken();
        const accessToken = localStorage.getItem('accessToken');
        try {
          const res = await axios.post('http://localhost:4000/userData', { refreshToken: localRefreshToken }, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          console.log(res.data)
          setIsLoggedIn(true)
          setCurrentUser(res.data);
          localStorage.setItem('currentUser', JSON.stringify(res.data));
        } catch (error) {
          console.error(error);
          setIsLoggedIn(false)
        }
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
