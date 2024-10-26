import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useEffect } from 'react';

// The main App component
function App() {
  useEffect(() => {
    // Log to help confirm that the token is correctly set during app initialization
    const token = localStorage.getItem('id_token');
    if (token) {
      console.log('JWT Token available: ', token);
    } else {
      console.warn('No JWT token found. User might not be authenticated.');
    }
  }, []); // Run once when the app mounts

  return (
    <>
      <Navbar /> {/* Navbar component */}
      <Outlet /> {/* Render the current page */}
    </>
  );
}

export default App;
