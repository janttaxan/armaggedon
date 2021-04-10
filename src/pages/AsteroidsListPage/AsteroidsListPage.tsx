import { useRef } from 'react';
import { useAsteroidsList } from '../../hooks/useAsteroidsList';
import { AsteroidListItem } from '../../components/AsteroidListItem';

export const AsteroidsListPage = () => {
  const bottomOfList = useRef<HTMLDivElement>(null);
  const { list, isLoading } = useAsteroidsList(bottomOfList);

  return (
    <main>
      <div>фильтры</div>
      <ul>
        {list.map((asteroid) => (
          <AsteroidListItem
            key={asteroid.id}
            name={asteroid.name}
          />
        ))}
        <div ref={bottomOfList}/>
      </ul>
      {isLoading && <span>загрузка...</span>}
    </main>
  );
};
