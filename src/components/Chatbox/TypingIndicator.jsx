import styles from './Chatbox.module.css';

export default function TypingIndicator({ typingList, users, currentUserId }) {
  // Show up to 2 other users typing
  return (
    <div className={styles.typing_indicator}>
      {typingList
        .filter(item => item.user_id !==  null)//currentUserId)
        .slice(0, 2)
        .map(item => (
          <div key={item.user_id} className={styles.typing_indicator_item}>
            <p>{users[item.user_id].user_name}</p>
            <div className={styles.typing_dot}></div>
            <div className={styles.typing_dot}></div>
            <div className={styles.typing_dot}></div>
          </div>
        ))}
    </div>
  );
}