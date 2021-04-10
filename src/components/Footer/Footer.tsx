import styles from './Footer.module.css';
import { useEffect, useState } from 'react';

export const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number>();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      <span>{currentYear}&nbsp;&copy; Все права и&nbsp;планета защищены</span>
    </footer>
  );
};
