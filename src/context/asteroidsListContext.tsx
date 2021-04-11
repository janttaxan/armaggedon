import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useRef, useState } from 'react';
import { Asteroid } from '../interfaces/Asteroid';
import { NOOP } from '../utils/NOOP';
import { AsteroidsListContext } from '../interfaces/AsteroidsListContext';
import { convertDate } from '../utils/convertDate';
import { AsteroidsListResponse } from '../interfaces/AsteroidsListResponse';


export const asteroidsListContext = createContext<AsteroidsListContext>({
  isLoading: false,
  errorValue: '',
  hasLoadButton: false,

  asteroidsList: [],
  dangerList: [],
  toDestroyList: [],
  isDangerList: false,

  addToDestroyList: NOOP,
  removeToDestroyList: NOOP,
  handleFilter: NOOP,
  handleLoad: NOOP,
});

export const AsteroidsListContextProvider = ({ children }: {children: ReactNode}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorValue, setErrorValue] = useState('');
  const [hasLoadButton, setHasLoadButton] = useState(false);

  const [asteroidsList, setAsteroidsList] = useState<Array<Asteroid>>([]);
  const [dangerList, setDangerList] = useState<Array<Asteroid>>([]);
  const [toDestroyList, setToDestroyList] = useState<Array<Asteroid>>([]);
  const [isDangerList, setIsDangerList] = useState(false);

  const nextLinkRef = useRef('');

  const observeCb = useCallback(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorValue('');

      if (dangerList.length < 4) {
        setHasLoadButton(true);
      }

      try {
        // получаем данные сегодняшнего дня, затем каждый следующий запрос возвращает данные за +1 день
        const response = nextLinkRef.current ?
          await fetch(nextLinkRef.current) :
          await fetch(`${process.env.REACT_APP_API_BASE_URL}/feed?start_date=${convertDate(new Date())}&end_date=${convertDate(new Date())}&api_key=${process.env.REACT_APP_API_KEY}`);

        const { near_earth_objects, links: { next } }: AsteroidsListResponse = await response.json();
        nextLinkRef.current = next; // получили ссылку на данные следующего дня

        // объеденили все массивы объекта "near_earth_objects"
        const combineArrays = Object.values(near_earth_objects).flat();
        setAsteroidsList(prevList => prevList.concat(...combineArrays));

        const dangerAteroids = combineArrays.filter((asteroid) => asteroid.is_potentially_hazardous_asteroid);
        if (dangerAteroids.length === 0) {
          setHasLoadButton(true);
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

  const handleAddRemoveToDestroyList = (fn: Dispatch<SetStateAction<Array<Asteroid>>>, id: string, action: 'ADD' | 'REMOVE') => {
    switch (action) {
      case 'ADD':
        fn(prevState => prevState.map((item) =>
          item.id === id ? { ...item, to_destroy: true } : item,
        ));
        break;
      case 'REMOVE':
        fn(prevState => prevState.map((item) =>
          item.id === id ? { ...item, to_destroy: false } : item,
        ));
        break;
    }
  };

  const addToDestroyList = (asteroid: Asteroid) => {
    handleAddRemoveToDestroyList(setAsteroidsList, asteroid.id, 'ADD');
    setTimeout(() => {
      handleAddRemoveToDestroyList(setDangerList, asteroid.id, 'ADD');
    }, 0);
    setTimeout(() => {
      setToDestroyList(prevList => prevList.concat(...[{ ...asteroid, to_destroy: true }]));
    }, 0);
  };

  const removeToDestroyList = (asteroid: Asteroid) => {
    handleAddRemoveToDestroyList(setAsteroidsList, asteroid.id, 'REMOVE');
    setTimeout(() => {
      handleAddRemoveToDestroyList(setDangerList, asteroid.id, 'REMOVE');
    }, 0);
    setTimeout(() => {
      handleAddRemoveToDestroyList(setToDestroyList, asteroid.id, 'REMOVE');
      setToDestroyList(prevList => prevList.filter((asteroid) => asteroid.to_destroy));
    }, 0);
  };

  const handleFilter = () => {
    setIsDangerList(prevState => !prevState);
  };

  const handleLoad = () => {
    observeCb();
    setHasLoadButton(false);
  };

  return (
    <asteroidsListContext.Provider
      value={{
        isLoading,
        errorValue,
        hasLoadButton,

        asteroidsList,
        dangerList,
        toDestroyList,
        isDangerList,

        addToDestroyList,
        removeToDestroyList,
        handleFilter,
        handleLoad,
      }}
    >
      {children}
    </asteroidsListContext.Provider>
  );
};
