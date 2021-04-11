import { useRef } from 'react';
import { useAsteroidsList } from '../../hooks/useAsteroidsList';
import { AsteroidListItem } from '../../components/AsteroidListItem';
import { getAverageSize } from '../../utils/getAverageSize';
import { getDate } from '../../utils/getDate';

export const AsteroidsListPage = () => {
  const bottomOfList = useRef<HTMLDivElement>(null);
  const { list, isLoading } = useAsteroidsList(bottomOfList);

  const handleAdding = (b: boolean) => {
    console.log(b);
  };

  return (
    <main>
      <div>фильтры</div>
      <ul>
        {list.map((asteroid) => (
          <AsteroidListItem
            key={asteroid.id}
            name={asteroid.name}
            date={getDate(asteroid.close_approach_data[0].close_approach_date)}
            size={getAverageSize(
              asteroid.estimated_diameter.meters.estimated_diameter_max,
              asteroid.estimated_diameter.meters.estimated_diameter_min,
            )}
            distance={+asteroid.close_approach_data[0].miss_distance.kilometers}
            isDangerous={asteroid.is_potentially_hazardous_asteroid}
            toBeDestroyed={false}
            onAdding={() => handleAdding(true)}
          />
        ))}
        <div ref={bottomOfList}/>
      </ul>
      {isLoading && <span>загрузка...</span>}
    </main>
  );
};
