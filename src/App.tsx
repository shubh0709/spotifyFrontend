import React, { useEffect, useState } from 'react';
import './App.module.css';
import { MyComponent } from './Home';
import { checkAuthentication, getLogin } from './api/api';
import { API_URL } from './constants';
import Cookies from 'universal-cookie';
import styles from './App.module.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const cookies = new Cookies();


  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    const isAuthenticatedCookie = cookies.get('isAuthenticated');
    if (isAuthenticatedCookie) {
      setIsAuthenticated(true);
      return;
    }

    try {
      const response = await checkAuthentication();
      setIsAuthenticated(response.isAuthenticated);
      if (!response.isAuthenticated) {
        window.location.href = `${API_URL}/login`;
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        {!isAuthenticated ?
          <h1 className={styles.loadingText}>Loading...</h1>
          : <MyComponent />}
      </header>
    </div>
  );
}

export default App;
