import React, {useContext} from 'react';
import Registration from './Pages/Registration';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/authContext';

// Pages
import Login from './Pages/Login';
import Home from './Pages/Home';
import NewCohort from './Pages/NewCohort';
import EmailConfirmation from './components/UserConfirmation';
import Verify from './Pages/Verify';
import Landing from './Pages/Landing'; 

const App = () => {
  const { currentUser, setIsLoggedIn } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Verify" element={<Verify />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/newCohort' element={<ProtectedRoute><NewCohort /></ProtectedRoute>} />
          <Route path='/confirmation/:token' element={<EmailConfirmation />} />
          <Route path="/landing" element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;