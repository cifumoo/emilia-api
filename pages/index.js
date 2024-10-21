// pages/index.js or Home.js

import styles from '../styles/Home.module.css';
import Layout from '../pages/Layout';
import Link from 'next/link';

const Home = () => {
  return (
    <Layout>
      <div className={`${styles.main} ${styles.flex} ${styles.flexCol} ${styles.itemsCenter} ${styles.justifyCenter}`}>
        <section className={`${styles.textCenter}`}>
          <h1 className={`${styles.text4xl} ${styles.fontBold} ${styles.textPrimary} ${styles.mb4}`}>Welcome to Emilia's API</h1>
          <p className={`${styles.textLg} ${styles.textGray600} ${styles.mb8}`}>A simple, free-to-use REST API without the need for an account, API key, or usage limits.</p>
          <div>
            <Link href="/docs" className={`${styles.textPrimary} ${styles.border} ${styles.borderPrimary} ${styles.py3} ${styles.px6} ${styles.roundedMd} ${styles.hoverBgPrimary} ${styles.hoverTextWhite}`}>
              Explore
            </Link> 
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;