import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { CohortContextProvider } from './context/cohortContext.jsx'; // Import the CohortContextProvider
import './style.scss';
import { StudentContextProvider } from './context/studentContext.jsx';
import { TeacherContextProvider } from './context/teacherContext.jsx';
import { PostContextProvider } from './context/postContext';
import { MessageContextProvider } from './context/messageContext.jsx'
import './login.scss'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <MessageContextProvider>
        <CohortContextProvider> {/* Wrap the App component with CohortContextProvider */}
          <StudentContextProvider>
            <TeacherContextProvider>
              <PostContextProvider>
                  <App />
              </PostContextProvider>
            </TeacherContextProvider>
          </StudentContextProvider>
        </CohortContextProvider>
      </MessageContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
