import React, { useEffect, useState } from 'react';
import './App.module.css';
import { MyComponent } from './Home';
import { checkAuthentication, getLogin } from './api/api';
import { API_URL } from './constants';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      const response = await checkAuthentication();
      console.log('Authentication check response:', response);
      setIsAuthenticated(response.isAuthenticated);
      if (!response.isAuthenticated) {
        window.location.href = `${API_URL}/login`;
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <MyComponent />
      </header>
    </div>
  );
}

export default App;
