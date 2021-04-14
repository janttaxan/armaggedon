import styles from './RequestToDestroyPage.module.css';
import { useContext, useState } from 'react';
import { asteroidsListContext } from '../../context/asteroidsListContext';
import { declOfNum } from '../../utils/declOfNum';
import { Link } from 'react-router-dom';

const asteroidsTitles = ['астероид', 'астероида', 'астероидов'];

export const RequestToDestroyPage = () => {
  const [earthIsSaved, setEarthIsSaved] = useState(false);

  const { toDestroyList, clearAllLists, removeToDestroyList } = useContext(asteroidsListContext);

  const handleSaved = () => {
    setEarthIsSaved(true);
    clearAllLists();
  };

  return (
    <main className={styles.requestToDestroyPage}>
      {!earthIsSaved && (
        <>
          <h1 className={styles.heading}>Заказать бригаду им. Брюса Уиллиса</h1>
          <p className={styles.subtitle}>
            В вашем заказе {toDestroyList.length} {declOfNum(toDestroyList.length, asteroidsTitles)}:
          </p>
          <ul className={styles.list}>
            {toDestroyList.map((asteroid) => (
              <li className={styles.item} key={asteroid.id}>
                <button className={styles.itemDelete} onClick={() => removeToDestroyList(asteroid)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="black"/>
                  </svg>
                </button>
                <Link className={styles.itemLink} to={`/asteroid/${asteroid.id}`}>{asteroid.name}</Link>
              </li>
            ))}
          </ul>
          {toDestroyList.length !== 0 && (
            <button className={styles.btn} onClick={handleSaved}>Спасти землю!</button>
          )}
          {toDestroyList.length === 0 && (
            <Link className={styles.itemLink} to='/'>К списку астероидов</Link>
          )}
        </>
      )}

      {earthIsSaved && (
        <>
          <h1 className={styles.heading}>Бригада отправлена на задание</h1>
          <p>За результатом выполнения вы можете следить по новостям...</p>
          <Link className={styles.itemLink} to='/'>Вернуться к списку астероидов</Link>
        </>
      )}
    </main>
  );
};
