import React, { useEffect, useState } from 'react';
import './App.module.css';
import { Home } from './Home';
import { checkAuthentication, getLogin } from './api/api';
import { API_URL } from './constants';
import Cookies from 'universal-cookie';


export function Check() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const cookies = new Cookies();

    console.log("component refreshed");

    useEffect(() => {
        console.log("inside useEffect");
        checkAuthenticationStatus();
    }, []);

    const checkAuthenticationStatus = async () => {
        setTimeout(async () => {
            console.log("check completed");
            console.log("cookie: ", document.cookie);
            const isAuthenticatedCookie = await cookies.get('isAuthenticated');
            console.log({ isAuthenticatedCookie });
            if (isAuthenticatedCookie) {
                setIsAuthenticated(true);
                return;
            }

            try {
                const response = await checkAuthentication();
                setIsAuthenticated(response.isAuthenticated);
                console.log("response is: ", JSON.stringify(response));
                if (response?.user) {
                    console.log("setting user");
                    setUser(response?.user);
                }
                if (!response.isAuthenticated) {
                    console.log("redirecting to /login of backend");
                    window.location.href = `${API_URL}/login`;
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
            }
        }, 2000);

    };

    return (<></>);
}