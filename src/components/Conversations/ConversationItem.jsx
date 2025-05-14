import {MdOutlineUnfoldMore} from "react-icons/md";

import styles from './Conversations.module.css';
import LastMessage from './LastMessage';
import { formatTimestamp, truncate } from '../../redux/reducers/dataReducer';


//  chatapp todo use selectors for getting user details
export default function ConversationItem({ convo, otherUsers, type, onSwipeStart, onSwipeEnd }) {
  const last = convo.messages.length > 0 ? convo.messages[convo.messages.length - 1] : null;
  return (
    <div
      className={
        type === 'duo' ? styles.duo_card : styles.groups_card
      }
      onMouseDown={(e) => onSwipeStart(e, { type, id: convo.id })}
      onTouchStart={(e) => onSwipeStart(e, { type, id: convo.id })}
      onMouseUp={(e) => onSwipeEnd(e, { type, id: convo.id })}
      onTouchEnd={(e) => onSwipeEnd(e, { type, id: convo.id })}
    >
      <div className={styles.card_overlay} />
      {/* user images */}
      <div className={
        type === 'duo'? styles.duo_user_image : styles.groups_user_img_container
      }>
        {otherUsers.slice(0,2).map((u, i) => (
          <img
            key={i}
            className={
              type === 'duo' ? styles.duo_user_image : styles.groups_user_img
            }
            src={u.img}
            alt=""
          />
        ))}
        {type === 'group' && <MdOutlineUnfoldMore size={20} className={styles.groups_user_img_more} />}
      </div>
      <div className={styles.user_details}>
        <p className={styles.user_name}>{convo.name? convo.name 
          : truncate(otherUsers.map((i) => i.user_name).join(","), 16)
          || otherUsers[0]?.user_name}</p>
        <div className={styles.last_message}>
          {last && <LastMessage item={last.data} />}
        </div>
      </div>
      <div className={styles.timestamp_container}>
        <div
          style={{ backgroundColor: otherUsers.some(u => u.is_online) ? 'green' : 'grey' }}
          className={styles.online_status}
        />
        <p className={styles.timestamp}>{last && formatTimestamp(last.timestamp)}</p>
      </div>
    </div>
  );
}