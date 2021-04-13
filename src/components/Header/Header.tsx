import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { asteroidsListContext } from '../../context/asteroidsListContext';
import classNames from 'classnames';

export const Header = () => {
  const [isShowMiniHeader, setIsShowMiniHeader] = useState(false);
  const { toDestroyList } = useContext(asteroidsListContext);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      scrolled >= 150
        ? setIsShowMiniHeader(true)
        : setIsShowMiniHeader(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const miniHeaderClasses = classNames(
    styles.miniHeader,
    { [styles.miniHeaderShow]: isShowMiniHeader },
  );

  return (
    <>
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

      <header className={miniHeaderClasses}>
        <div className={styles.container}>
          <h2 className={styles.logo}>ARMAGGEDON V</h2>
          <nav className={styles.nav}>
            <NavLink exact className={styles.link} activeClassName={styles.active} to='/'>
              Астероиды
            </NavLink>
            <NavLink exact className={styles.link} activeClassName={styles.active} to='/destroy'>
              Уничтожение
              {toDestroyList.length > 0 && <span className={styles.count}>{toDestroyList.length}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
};
