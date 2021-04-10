import { Asteroid } from './Asteroid';

export interface AsteroidsListResponse {
  element_count: number,
  links: {
    next: string,
    prev: string,
    self: string,
  }
  near_earth_objects: {
    [key: string]: Array<Asteroid>
  }
}
