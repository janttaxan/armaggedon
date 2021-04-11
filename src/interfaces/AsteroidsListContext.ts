import { Asteroid } from './Asteroid';

export interface AsteroidsListContext {
  isLoading: boolean,
  errorValue: string,
  hasLoadButton: boolean,

  asteroidsList: Array<Asteroid>,
  dangerList: Array<Asteroid>,
  toDestroyList: Array<Asteroid>,
  isDangerList: boolean,

  addToDestroyList: (asteroid: Asteroid) => void,
  removeToDestroyList: (asteroid: Asteroid) => void,
  handleFilter: () => void,
  handleLoad: () => void,
}
