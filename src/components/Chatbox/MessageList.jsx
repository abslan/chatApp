import { useRef, useEffect, useMemo, memo } from 'react';
import {MessageItem} from './MessageItem';
import styles from './Chatbox.module.css';

export const MessageList = memo(({ messages, onScrollTop}) => {
  const containerRef = useRef(null);

  const hasMountedRef = useRef(false);

   useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (container.scrollTop === 0 && container.scrollHeight > container.clientHeight && hasMountedRef.current) {
        onScrollTop?.(); // call fetchMore
      }
    };
    container.addEventListener("scroll", handleScroll);
    hasMountedRef.current = true;
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onScrollTop]);
  
  //chatapp todo replace with useLayoutEffect and test
  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);


  const visibleMessages = useMemo(()=> messages.map((msg) => (
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
});