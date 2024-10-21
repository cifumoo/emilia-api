// components/Header.js
import { useState } from 'react';
import { FaGithub, FaSun, FaMoon } from 'react-icons/fa';
import styles from '../styles/Header.module.css';

const Header = ({ toggleSidebar, toggleTheme, theme }) => {
  return (
    <header className={styles.header}>
      <button onClick={toggleSidebar} className={styles.menuButton}>☰</button>
      <div className={styles.logo}>Emilia's API</div>
      <div className={styles.icons}>
        <a href="https://github.com/cifumo" target="_blank" rel="noopener noreferrer">
          <FaGithub className={styles.icon} />
        </a>
        <button onClick={toggleTheme} className={styles.themeButton}>
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;