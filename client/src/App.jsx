// App.js
import React, {useContext} from 'react';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/authContext';
import NewCohort from './Pages/NewCohort';

const App = () => {
  const { currentUser } = useContext(AuthContext);

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
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/newCohort' element={<ProtectedRoute><NewCohort /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
