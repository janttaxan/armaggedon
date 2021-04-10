import styles from './AsteroidListItem.module.css';

export const AsteroidListItem = ({ name }: {name: string}) => {
  return (
    <li className={styles.asteroidListItem} style={{ padding: '16px 0' }}>
      {name}
    </li>
  );
};
