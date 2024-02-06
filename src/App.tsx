import React, { useEffect, useState } from 'react';
import './App.module.css';
import { Home } from './Home';
import { checkAuthentication, getLogin } from './api/api';
import { API_URL } from './constants';
import Cookies from 'universal-cookie';
import styles from './App.module.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Test } from './test';
import { Check } from './Check';



function App() {

  return (
    <BrowserRouter>
      <div className={styles.App}>
        <header className={styles.appHeader}>
          <Routes>
            <Route path="/" element={<Check />} />
            <Route path="/home" element={<Home username={"temp"} />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
