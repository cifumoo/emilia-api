// components/Layout.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import styles from '../styles/Layout.module.css';
import Header from '../components/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      }
    }
  }, []);

  return (
    <div className={`${styles.container} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <Header toggleSidebar={toggleSidebar} toggleTheme={toggleTheme} theme={theme} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
