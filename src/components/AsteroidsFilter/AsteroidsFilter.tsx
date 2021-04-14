import styles from './AsteroidsFilter.module.css';
import { ChangeEvent } from 'react';

export enum DistanceType {
  km = 'в километрах',
  moon = 'в дистанциях до луны',
}

interface Props {
  isDanger: boolean,
  onChangeCheckbox: () => void,
  onChangeRadio: (e: ChangeEvent<HTMLInputElement>) => void,
}

export const AsteroidsFilter = ({ isDanger, onChangeCheckbox, onChangeRadio }: Props) => {
  return (
    <div className={styles.asteroidsFilter}>
      <div className={styles.byDanger}>
        <input
          className={styles.checkbox}
          name="is danger"
          type="checkbox"
          id="is-danger"
          checked={isDanger}
          onChange={onChangeCheckbox}
        />
        <label htmlFor="is-danger">Показать только опасные</label>
      </div>

      <div className={styles.byDistance}>
        Расстояние,&nbsp;
        <label className={styles.radio}>
          <input
            type="radio"
            name="distance"
            value={DistanceType.km}
            onChange={onChangeRadio}
            defaultChecked
          />
          <span>в&nbsp;километрах</span>,&nbsp;
        </label>
        <label className={styles.radio}>
          <input
            className={styles.radio}
            type="radio"
            name="distance"
            value={DistanceType.moon}
            onChange={onChangeRadio}
          />
          <span>в&nbsp;дистанциях до&nbsp;луны</span>
        </label>
      </div>
    </div>
  );
};
