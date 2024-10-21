import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button onClick={toggleSidebar} className={styles.closeButton}>✖</button>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About us</Link>
          </li>
          <li>
            <Link href="/ai">Chat with emilia</Link>
          </li>
          <li>
            <Link href="/docs">Documentation</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;