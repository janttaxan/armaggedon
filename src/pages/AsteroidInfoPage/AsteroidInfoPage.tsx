import styles from './AsteroidInfoPage.module.css';
import { useParams, useHistory } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Asteroid, CloseApproachData } from '../../interfaces/Asteroid';
import { AsteroidListItem } from '../../components/AsteroidListItem';
import { getDate, getDateTime } from '../../utils/getDateTime';
import { getAverageSize } from '../../utils/getAverageSize';
import { asteroidsListContext } from '../../context/asteroidsListContext';
import { formatNumber } from '../../utils/formatNumber';

export const AsteroidInfoPage = () => {
  const [asteroidInfo, setAsteroidInfo] = useState<Asteroid | undefined>(undefined);

  const { addToDestroyList, removeToDestroyList, toDestroyList } = useContext(asteroidsListContext);

  const { id } = useParams<{id: string}>();
  const history = useHistory();

  function getClosesApproachDate(arr: Array<CloseApproachData>): string {
    const beginningOfToday = new Date().setHours(0, 0).valueOf();
    const futureApproaches = arr.filter((date) =>
      Number(date.epoch_date_close_approach) > beginningOfToday);

    return futureApproaches[0].close_approach_date;
  }

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/neo/${id}?api_key=${process.env.REACT_APP_API_KEY}`);
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
            date={getDate(getClosesApproachDate(asteroidInfo.close_approach_data))}
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
          <section className={styles.more}>
            <h2 className={styles.moreHeading}>Все сближения астероида:</h2>
            <ul className={styles.moreList}>
              {asteroidInfo.close_approach_data.map((approach) => (
                <li className={styles.moreItem} key={approach.close_approach_date}>
                  <strong className={styles.moreDate}>{getDateTime(approach.close_approach_date_full)}</strong>
                  <ul className={styles.info}>
                    <li className={styles.infoItem}>
                      <span className={styles.infoProp}>Орбита</span>
                      <span className={styles.infoValue}>{approach.orbiting_body}</span>
                    </li>
                    <li className={styles.infoItem}>
                      <span className={styles.infoProp}>Скорость, км/ч</span>
                      <span className={styles.infoValue}>
                        {formatNumber(Math.round(+approach.relative_velocity.kilometers_per_hour))}
                      </span>
                    </li>
                    <li className={styles.infoItem}>
                      <span className={styles.infoProp}>Скорость, км/сек</span>
                      <span className={styles.infoValue}>
                        {formatNumber(Math.round(+approach.relative_velocity.kilometers_per_second))}
                      </span>
                    </li>
                    <li className={styles.infoItem}>
                      <span className={styles.infoProp}>Расстояние до Земли, км</span>
                      <span className={styles.infoValue}>
                        {formatNumber(Math.round(+approach.miss_distance.kilometers))}
                      </span>
                    </li>
                    <li className={styles.infoItem}>
                      <span className={styles.infoProp}>Расстояние до Земли, дист. до луны</span>
                      <span className={styles.infoValue}>
                        {formatNumber(Math.round(+approach.miss_distance.lunar))}
                      </span>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
};
