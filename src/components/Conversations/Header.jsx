import { MdAddCircleOutline } from 'react-icons/md';
import styles from './Conversations.module.css';

export default function Header({ title, children }) {
  return (
    <div className={styles.header}>
      <h5 className={styles.title}>{title}</h5>
      {children || <MdAddCircleOutline className={styles.add_btn} size={20} />}
    </div>
  );
}