import { useRef } from 'react';
import { MdOutlineAttachFile } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import styles from './Chatbox.module.css';

export default function ChatInput({ onSend, onFileChange, onTyping }) {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleKeyDown = e => {
    // Notify parent that user started typing
    onTyping('typing');
    // Clear existing timeout
    clearTimeout(timeoutRef.current);
    // Set timeout to notify typing finished after 1s of inactivity
    timeoutRef.current = setTimeout(() => {
      onTyping('finished');
    }, 1000);

    if (e.key === 'Enter') {
      // Immediately send message on Enter
      handleSend();
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSend = () => {
    const text = inputRef.current.value.trim();
    if (text) {
      onSend(text);
      inputRef.current.value = '';
      // After sending, notify finished typing
      onTyping('finished');
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className={styles.chatbox_form}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter message"
        onKeyDown={handleKeyDown}
        className={styles.chatbox_input}
      />
      <div>
        <MdOutlineAttachFile
          className={styles.chatbox_attach_btn}
          onClick={() => fileInputRef.current.click()}
          size={20}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>
      <FiSend
        className={styles.chatbox_send_btn}
        onClick={handleSend}
      />
    </div>
  );
}