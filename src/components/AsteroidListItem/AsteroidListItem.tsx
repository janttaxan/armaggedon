import styles from './AsteroidListItem.module.css';
import classNames from 'classnames';
import { Dinosaur, Meteor } from '../Icons';
import { formatNumber } from '../../utils/formatNumber';

interface Props {
  name: string,
  date: string,
  distance: number,
  size: number,
  isDangerous: boolean,
  toBeDestroyed: boolean,
  onAdding: () => void,
}

export const AsteroidListItem = (props: Props) => {
  const { name, date, distance, size, isDangerous, toBeDestroyed, onAdding } = props;

  const asteroidItemClasses = classNames(
    styles.asteroidListItem,
    { [styles.isDangerous]: isDangerous },
  );

  const meteorClasses = classNames(
    styles.meteor,
    { [styles.sm]: Number(size) < 100 },
    { [styles.md]: Number(size) >= 100 && Number(size) < 500 },
    { [styles.lg]: Number(size) >= 500 },
  );

  const buttonClasses = classNames(
    styles.button,
    { [styles.toBeDestroyed]: toBeDestroyed },
  );

  return (
    <li className={asteroidItemClasses}>
      <div className={styles.info}>
        <a className={styles.link} href="#qwe">
          <h3 className={styles.title}>{name}</h3>
        </a>
        <ul className={styles.infoList}>
          <li className={styles.infoItem}>
            <span className={styles.infoTitle}>Дата</span>
            <span className={styles.infoDottedLine}/>
            <span className={styles.infoValue}>{date}</span>
          </li>
          <li className={styles.infoItem}>
            <span className={styles.infoTitle}>Расстояние</span>
            <span className={styles.infoDottedLine}/>
            <span className={styles.infoValue}>{formatNumber(Math.round(Number(distance)))} км</span>
          </li>
          <li className={styles.infoItem}>
            <span className={styles.infoTitle}>Размер</span>
            <span className={styles.infoDottedLine}/>
            <span className={styles.infoValue}>{formatNumber(Math.round(size))} м</span>
          </li>
        </ul>
      </div>

      <div className={styles.options}>
        <span className={styles.danger}>Оценка</span>
        <strong className={styles.dangerValue}>
          {isDangerous ? 'опасен' : 'не опасен'}
        </strong>
        <button className={buttonClasses} onClick={onAdding}>
          {!toBeDestroyed ? 'На уничтожение' : 'Добавлен в список'}
        </button>
      </div>

      <div className={styles.dino}>
        <Dinosaur/>
      </div>

      <div className={meteorClasses}>
        <Meteor/>
      </div>
    </li>
  );
};

