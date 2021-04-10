import styles from './Layout.module.css';
import { ReactNode } from 'react';

export const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
};
