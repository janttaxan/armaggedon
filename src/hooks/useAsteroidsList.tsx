import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Asteroid } from '../interfaces/Asteroid';
import { convertDate } from '../utils/convertDate';
import { AsteroidsListResponse } from '../interfaces/AsteroidsListResponse';


export const useAsteroidsList = (observeRef: RefObject<HTMLDivElement>) => {
  const [list, setList] = useState<Array<Asteroid>>([]);
  const [dangerList, setDangerList] = useState<Array<Asteroid>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorValue, setErrorValue] = useState('');
  const [isDangerList, setIsDangerList] = useState(false);
  const [isLoadButton, setIsLoadButton] = useState(false);

  const nextRef = useRef('');

  const observeCb = useCallback(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorValue('');

      if (dangerList.length < 4) {
        setIsLoadButton(true);
      }

      try {
        // получаем данные сегодняшнего дня, затем каждый следующий запрос возвращает данные за +1 день
        const response = nextRef.current ?
          await fetch(nextRef.current) :
          await fetch(`${process.env.REACT_APP_API_BASE_URL}/feed?start_date=${convertDate(new Date())}&end_date=${convertDate(new Date())}&api_key=${process.env.REACT_APP_API_KEY}`);

        const { near_earth_objects, links: { next } }: AsteroidsListResponse = await response.json();
        nextRef.current = next; // получили ссылку на данные следующего дня

        // объеденили все массивы объекта "near_earth_objects"
        const combineArrays = Object.values(near_earth_objects).flat();
        setList(prevList => prevList.concat(...combineArrays));

        const dangerAteroids = combineArrays.filter((asteroid) => asteroid.is_potentially_hazardous_asteroid);
        if (dangerAteroids.length === 0) {
          setIsLoadButton(true);
        }

        setDangerList(prevState => prevState.concat(...dangerAteroids));
      } catch (e) {
        setErrorValue(String(e));
      } finally {
        setIsLoading(false);
      }
    }

    loadData().then();
  }, [dangerList.length]);


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry &&
        entry.isIntersecting &&
        list.length === 0 &&
        dangerList.length === 0
      ) {
        observeCb();
      }
    }, { rootMargin: '50px' });

    if (observeRef.current) {
      observer.observe(observeRef.current);
    }
  }, [observeCb, observeRef, isDangerList, list.length, dangerList.length]);

  const handleFilter = () => {
    setIsDangerList(prevState => !prevState);
  };

  const handleLoad = () => {
    observeCb();
    setIsLoadButton(false);
  };

  return { list, dangerList, isLoading, errorValue, isDangerList, isLoadButton, handleFilter, handleLoad };
};
