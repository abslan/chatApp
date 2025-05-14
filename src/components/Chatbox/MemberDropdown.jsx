import styles from './Chatbox.module.css';
import { HiUserAdd, HiUserRemove } from 'react-icons/hi';

export default function MemberDropdown({ users, onAdd, onRemove, renderTrigger }) {
  return (
    <div className={styles.dropdown_container}>
      {renderTrigger()}
      <div className={styles.dropdown_content}>
        {users.map(user => (
          <div key={user.id} className={styles.dropdown_user_card}>
            <img src={user.img} alt="" className={styles.dropdown_user_img} />
            <p className={styles.dropdown_user_name}>{user.user_name}</p>
            {onRemove && (
              <HiUserRemove
                size={20}
                className={styles.add_member_btn}
                onClick={() => onRemove(user)}
              />
            )}
            {onAdd && (
              <HiUserAdd
                size={20}
                className={styles.add_member_btn}
                onClick={() => onAdd(user)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}