import styles from './Conversations.module.css';
import { formatImageSource } from '../../redux/reducers/dataReducer';

export default function DropdownUserCard({ user, onClick, children }) {
  return (
    <div className={styles.dropdown_user_card} onClick={onClick}>
      <img className={styles.dropdown_user_img} src={formatImageSource(user.img)} alt="" />
      <p className={styles.dropdown_user_name}>{user.user_name}</p>
      {
        children
      }
    </div>
  );
}