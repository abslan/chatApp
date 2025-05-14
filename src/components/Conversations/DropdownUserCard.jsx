import styles from './Conversations.module.css';

export default function DropdownUserCard({ user, onClick }) {
  return (
    <div className={styles.dropdown_user_card} onClick={onClick}>
      <img className={styles.dropdown_user_img} src={user.img} alt="" />
      <p className={styles.dropdown_user_name}>{user.user_name}</p>
    </div>
  );
}