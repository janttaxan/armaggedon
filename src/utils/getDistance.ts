import { DistanceType } from '../components/AsteroidsFilter';
import { Asteroid } from '../interfaces/Asteroid';

export const getDistance = (type: DistanceType, asteroid: Asteroid): number => {
  switch (type) {
    case DistanceType.km:
      return +asteroid.close_approach_data[0].miss_distance.kilometers;
    case DistanceType.moon:
      return +asteroid.close_approach_data[0].miss_distance.lunar;
  }
};
