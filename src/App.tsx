import React, { useEffect, useState } from 'react';
import './App.module.css';
import { Home } from './Home';
import { checkAuthentication, getLogin } from './api/api';
import { API_URL } from './constants';
import Cookies from 'universal-cookie';
import styles from './App.module.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
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
      console.log(JSON.stringify(response.user));
      if (response?.user) {
        setUser(response?.user);
      }
      if (!response.isAuthenticated) {
        window.location.href = `${API_URL}/login`;
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };


  return (
    <div className={styles.App}>
      <header className={styles.appHeader}>
        {!isAuthenticated ?
          <h1 className={styles.loadingText}>Loading...</h1>
          :
          <>
            <h1 className={styles.loadingText}> Welcome, {user ? user.display_name : 'Guest'}</h1>
            <Home username={user.display_name} />
          </>
        }
      </header>
    </div>
  );
}

export default App;
