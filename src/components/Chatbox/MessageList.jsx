import { useRef, useEffect, useMemo } from 'react';
import {MessageItem} from './MessageItem';
import styles from './Chatbox.module.css';

export default function MessageList({ messages}) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  const visibleMessages = useMemo(()=> messages.map((msg, idx) => (
        <MessageItem
          key={msg.msg_id}
          message={msg}
        />
      )), [messages])
  
  return (
    <div className={styles.messages_container} ref={containerRef}>
      {visibleMessages}
    </div>
  );
}