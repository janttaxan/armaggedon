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
  clearAllLists: NOOP,
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

  // const nextLinkRef = useRef('');

  const setNextDate = (prevDate: Date, nextValue: number): Date => {
    const newDate = new Date(prevDate);
    newDate.setDate(prevDate.getDate() + nextValue);
    return newDate;
  };

  const startDate = useRef<Date>(new Date());
  const endDate = useRef<Date>(setNextDate(startDate.current, 1));

  const observeCb = useCallback(() => {

    async function loadData() {
      setIsLoading(true);
      setErrorValue('');

      try {
        // получаем данные сегодняшнего дня, затем каждый следующий запрос возвращает данные за +1 день
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/feed?start_date=${convertDate(startDate.current)}&end_date=${convertDate(endDate.current)}&api_key=${process.env.REACT_APP_API_KEY}`);

        const { near_earth_objects }: AsteroidsListResponse = await response.json();
        // увеличиваем диапазон дат запроса на +1
        startDate.current = setNextDate(endDate.current, 1);
        endDate.current = setNextDate(startDate.current, 1);

        // объеденили все массивы объекта "near_earth_objects" и "развернули"
        const combineArrays = Object.values(near_earth_objects).flat().reverse();
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
        if (isDangerList && dangerList.length < 4) {
          setHasLoadButton(true);
        }
      }
    }

    loadData().then();
  }, [dangerList.length, isDangerList]);

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

  const clearAllLists = () => {
    setAsteroidsList([]);
    setDangerList([]);
    setToDestroyList([]);
    startDate.current = new Date();
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
        clearAllLists,
        handleFilter,
        handleLoad,
      }}
    >
      {children}
    </asteroidsListContext.Provider>
  );
};
