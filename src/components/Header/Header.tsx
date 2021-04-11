import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { asteroidsListContext } from '../../context/asteroidsListContext';

export const Header = () => {
  const { toDestroyList } = useContext(asteroidsListContext);

  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h2 className={styles.logo}>ARMAGGEDON V</h2>
        <p className={styles.description}>
          Сервис мониторинга и уничтожения астероидов, опасно подлетающих к Земле.
        </p>
      </div>
      <nav className={styles.nav}>
        <NavLink exact className={styles.link} activeClassName={styles.active} to='/'>
          Астероиды
        </NavLink>
        <NavLink exact className={styles.link} activeClassName={styles.active} to='/destroy'>
          Уничтожение
          {toDestroyList.length > 0 && <span className={styles.count}>{toDestroyList.length}</span>}
        </NavLink>
      </nav>
    </header>
  );
};
