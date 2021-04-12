import styles from './AsteroidInfoPage.module.css';
import { useParams, useHistory } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Asteroid } from '../../interfaces/Asteroid';
import { AsteroidListItem } from '../../components/AsteroidListItem';
import { getDate } from '../../utils/getDate';
import { getAverageSize } from '../../utils/getAverageSize';
import { asteroidsListContext } from '../../context/asteroidsListContext';

export const AsteroidInfoPage = () => {
  const [asteroidInfo, setAsteroidInfo] = useState<Asteroid | undefined>(undefined);

  const { addToDestroyList, removeToDestroyList, toDestroyList } = useContext(asteroidsListContext);

  const { id } = useParams<{id: string}>();
  const history = useHistory();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/neo/${id}`);
        const data: Asteroid = await response.json();
        setAsteroidInfo(data);
      } catch (e) {
        console.log(e);
      }
    }

    loadData().then();
  }, [id]);

  const checkToDestroyList = (id: string): boolean => {
    return !!toDestroyList.find((asteroid) => asteroid.id === id);
  };

  return (
    <main>
      <div className={styles.head}>
        <button className={styles.buttonBack} onClick={() => history.goBack()}>Назад</button>
      </div>

      {asteroidInfo && (
        <>
          <AsteroidListItem
            key={asteroidInfo.id}
            id={asteroidInfo.id}
            name={asteroidInfo.name}
            date={getDate(asteroidInfo.close_approach_data[0].close_approach_date)}
            size={getAverageSize(
              asteroidInfo.estimated_diameter.meters.estimated_diameter_max,
              asteroidInfo.estimated_diameter.meters.estimated_diameter_min,
            )}
            distance={+asteroidInfo.close_approach_data[0].miss_distance.kilometers}
            isDangerous={asteroidInfo.is_potentially_hazardous_asteroid}
            toBeDestroyed={checkToDestroyList(id)}
            onAdding={
              checkToDestroyList(id) ?
                () => removeToDestroyList(asteroidInfo) :
                () => addToDestroyList(asteroidInfo)
            }
          />
        </>
      )}
    </main>
  );
};
