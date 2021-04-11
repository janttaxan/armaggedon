import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { AsteroidListItem } from '../../components/AsteroidListItem';
import { getAverageSize } from '../../utils/getAverageSize';
import { getDate } from '../../utils/getDate';
import { AsteroidsFilter, DistanceType } from '../../components/AsteroidsFilter';
import { asteroidsListContext } from '../../context/asteroidsListContext';
import { getDistance } from '../../utils/getDistance';


export const AsteroidsListPage = () => {
  const {
    isLoading,
    // errorValue,
    hasLoadButton,

    asteroidsList,
    dangerList,
    isDangerList,

    addToDestroyList,
    removeToDestroyList,
    handleFilter,
    handleLoad,
  } = useContext(asteroidsListContext);

  const [distanceType, setDistanceType] = useState<DistanceType>(DistanceType.km);

  const bottomOfList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry &&
        entry.isIntersecting &&
        asteroidsList.length === 0 &&
        dangerList.length === 0
      ) {
        handleLoad();
      }
    }, { rootMargin: '50px' });

    if (bottomOfList.current) {
      observer.observe(bottomOfList.current);
    }
  }, []);

  const handleRadio = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== DistanceType.km && e.target.value !== DistanceType.moon) return;
    setDistanceType(e.target.value);
  };

  const getList = (isDanger: boolean) => isDanger ? dangerList : asteroidsList;

  return (
    <main>
      <AsteroidsFilter
        isDanger={isDangerList}
        onChangeCheckbox={handleFilter}
        onChangeRadio={handleRadio}
      />
      <ul>
        {getList(isDangerList).map((asteroid) => (
          <AsteroidListItem
            key={asteroid.id}
            name={asteroid.name}
            date={getDate(asteroid.close_approach_data[0].close_approach_date)}
            size={getAverageSize(
              asteroid.estimated_diameter.meters.estimated_diameter_max,
              asteroid.estimated_diameter.meters.estimated_diameter_min,
            )}
            distance={getDistance(distanceType, asteroid)}
            distanceType={distanceType}
            isDangerous={asteroid.is_potentially_hazardous_asteroid}
            toBeDestroyed={asteroid.to_destroy ? asteroid.to_destroy : false}
            onAdding={
              asteroid.to_destroy ?
                () => removeToDestroyList(asteroid) :
                () => addToDestroyList(asteroid)
            }
          />
        ))}
        <div ref={bottomOfList}/>
      </ul>

      {hasLoadButton && !isLoading && (
        <button onClick={handleLoad}>Повторить загрузку</button>
      )}
      {isLoading && <span>загрузка...</span>}
    </main>
  );
};
