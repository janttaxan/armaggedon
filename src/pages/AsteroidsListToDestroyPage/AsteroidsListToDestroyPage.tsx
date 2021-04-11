import styles from './AsteroidsListToDestroyPage.module.css';
import { useContext } from 'react';
import { asteroidsListContext } from '../../context/asteroidsListContext';
import { AsteroidListItem } from '../../components/AsteroidListItem';
import { getDate } from '../../utils/getDate';
import { getDistance } from '../../utils/getDistance';
import { DistanceType } from '../../components/AsteroidsFilter';
import { getAverageSize } from '../../utils/getAverageSize';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export const AsteroidsListToDestroyPage = () => {
  const {
    isLoading,
    // errorValue,
    toDestroyList,
    removeToDestroyList,
  } = useContext(asteroidsListContext);

  const requestBtnClassses = classNames(
    styles.link,
    styles.request,
  );

  return (
    <main>
      <h1 className={styles.heading}>Список астероидов на уничтожение</h1>
      <ul>
        {toDestroyList.map((asteroid) => (
          <AsteroidListItem
            key={asteroid.id}
            name={asteroid.name}
            date={getDate(asteroid.close_approach_data[0].close_approach_date)}
            distance={getDistance(DistanceType.km, asteroid)}
            distanceType={DistanceType.km}
            size={getAverageSize(
              asteroid.estimated_diameter.meters.estimated_diameter_max,
              asteroid.estimated_diameter.meters.estimated_diameter_min,
            )}
            isDangerous={asteroid.is_potentially_hazardous_asteroid}
            toBeDestroyed={asteroid.to_destroy ? asteroid.to_destroy : false}
            onAdding={() => removeToDestroyList(asteroid)}
          />
        ))}
      </ul>

      {toDestroyList.length === 0 && (
        <div className={styles.empty}>
          <span>Список астероидов сейчас пуст...</span>
          <Link className={styles.link} to="/">Выбрать астероиды!</Link>
        </div>
      )}

      {toDestroyList.length > 0 && (
        <Link className={requestBtnClassses} to="/request">Заказать бридагу по уничтожению!</Link>
      )}

      {isLoading && <span>загрузка...</span>}
    </main>
  );
};
