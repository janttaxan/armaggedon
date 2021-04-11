import styles from './RequestToDestroyPage.module.css';
import { useContext, useState } from 'react';
import { asteroidsListContext } from '../../context/asteroidsListContext';
import { declOfNum } from '../../utils/declOfNum';
import { Link } from 'react-router-dom';

const asteroidsTitles = ['астероид', 'астероида', 'астероидов'];

export const RequestToDestroyPage = () => {
  const [earthIsSaved, setEarthIsSaved] = useState(false);

  const { toDestroyList, clearAllLists } = useContext(asteroidsListContext);

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
                <Link className={styles.itemLink} to='/'>{asteroid.name}</Link>
              </li>
            ))}
          </ul>
          {toDestroyList.length !== 0 && (
            <button className={styles.btn} onClick={handleSaved}>Спасти землю!</button>
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
