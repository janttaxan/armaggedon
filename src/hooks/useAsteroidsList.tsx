import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Asteroid } from '../interfaces/Asteroid';
import { convertDate } from '../utils/convertDate';
import { AsteroidsListResponse } from '../interfaces/AsteroidsListResponse';


export const useAsteroidsList = (observeRef: RefObject<HTMLDivElement>) => {
  const [list, setList] = useState<Array<Asteroid>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorValue, setErrorValue] = useState('');

  const nextRef = useRef('');

  const observeCb = useCallback(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorValue('');
      try {
        // получаем данные сегодняшнего дня, затем каждый следующий запрос возвращает данные за +1 день
        const response = nextRef.current ?
          await fetch(nextRef.current) :
          await fetch(`${process.env.REACT_APP_API_BASE_URL}/feed?start_date=${convertDate(new Date())}&end_date=${convertDate(new Date())}&api_key=${process.env.REACT_APP_API_KEY}`);

        const { near_earth_objects, links: { next } }: AsteroidsListResponse = await response.json();
        nextRef.current = next; // получили ссылку на данные следующего дня

        // объеденили все массивы объекта "near_earth_objects"
        setList(prevList =>
          prevList.concat(...Object.values(near_earth_objects).flat()),
        );
      } catch (e) {
        setErrorValue(String(e));
      } finally {
        setIsLoading(false);
      }
    }

    loadData().then();
  }, [nextRef]);


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        observeCb();
      }
    }, { rootMargin: '50px' });

    if (observeRef.current) {
      observer.observe(observeRef.current);
    }
  }, [observeCb, observeRef]);


  return { list, isLoading, errorValue };
};
