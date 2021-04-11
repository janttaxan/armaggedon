import { ChangeEvent, useRef, useState } from 'react';
import { useAsteroidsList } from '../../hooks/useAsteroidsList';
import { AsteroidListItem } from '../../components/AsteroidListItem';
import { getAverageSize } from '../../utils/getAverageSize';
import { getDate } from '../../utils/getDate';
import { AsteroidsFilter, DistanceType } from '../../components/AsteroidsFilter';
import { Asteroid } from '../../interfaces/Asteroid';

export const AsteroidsListPage = () => {
  const bottomOfList = useRef<HTMLDivElement>(null);
  const {
    list,
    dangerList,
    isLoading,
    isDangerList,
    isLoadButton,
    handleLoad,
    handleFilter,
  } = useAsteroidsList(bottomOfList);

  const [distanceType, setDistanceType] = useState<DistanceType>(DistanceType.km);

  const handleAdding = (b: boolean) => {
    console.log(b);
  };

  const handleRadio = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== DistanceType.km && e.target.value !== DistanceType.moon) return;
    setDistanceType(e.target.value);
  };

  const getDistance = (type: DistanceType, asteroid: Asteroid): number => {
    switch (type) {
      case DistanceType.km:
        return +asteroid.close_approach_data[0].miss_distance.kilometers;
      case DistanceType.moon:
        return +asteroid.close_approach_data[0].miss_distance.lunar;
    }
  };

  const getList = (isDanger: boolean) => isDanger ? dangerList : list;

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
            toBeDestroyed={false}
            onAdding={() => handleAdding(true)}
          />
        ))}
        <div ref={bottomOfList}/>
      </ul>

      {isLoadButton && !isLoading && (
        <button onClick={handleLoad}>Повторить загрузку</button>
      )}
      {isLoading && <span>загрузка...</span>}
    </main>
  );
};
