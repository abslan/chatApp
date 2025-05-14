import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import styles from './Chatbox.module.css';

export default function MessageList({ messages, users, currentUserId }) {
  const containerRef = useRef(null);
  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);
  
  return (
    <div className={styles.messages_container} ref={containerRef}>
      {messages.map((msg, idx) => (
        <MessageItem
          key={idx}
          message={msg}
          user={users[msg.user_id]}
          isOwn={msg.user_id === currentUserId}
          currentUserId = {currentUserId}
        />
      ))}
    </div>
  );
}