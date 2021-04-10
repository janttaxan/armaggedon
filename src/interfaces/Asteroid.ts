export interface Asteroid {
  close_approach_data: Array<CloseApproachData>,
  estimated_diameter: {
    feet: EstimatedDiameter,
    kilometers: EstimatedDiameter,
    meters: EstimatedDiameter,
    miles: EstimatedDiameter
  }
  id: string,
  is_potentially_hazardous_asteroid: boolean,
  is_sentry_object: boolean,
  links: {
    self: string,
  }
  name: string,
  nasa_jpl_url: string,
  neo_reference_id: string,
}

interface CloseApproachData {
  close_approach_date: string,
  close_approach_date_full: string,
  epoch_date_close_approach: string,
  miss_distance: {
    astronomical: string,
    kilometers: string,
    lunar: string,
    miles: string,
  },
  orbiting_body: string,
  relative_velocity: {
    kilometers_per_hour: string,
    kilometers_per_second: string,
    miles_per_hour: string,
  }
}

interface EstimatedDiameter {
  estimated_diameter_max: number,
  estimated_diameter_min: number
}
