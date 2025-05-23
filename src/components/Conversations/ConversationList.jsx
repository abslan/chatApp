import {ConversationItem} from './ConversationItem';
import styles from './Conversations.module.css';
import { memo } from 'react';

export const ConversationList = memo(({  current_user_convo_list, convo_list, users,
   currentUserId, onNewDuo, onSwipeStart, onSwipeEnd, type }) => {

  console.log("convo list rendered")
  if (type) {
    return (
      <div className={
            type === 'duo' ? styles.duo_container : styles.groups_container
        }>
        {current_user_convo_list.map((id, index)  => {
          const convo = convo_list[id];
        //  chatapp todo use selectors for getting covo 
          if (!convo.visible_for.includes(currentUserId)) return null;
          const others = convo.user_ids.filter(i => i !== currentUserId).map(i => users[i]);
          return (
            <ConversationItem
              key={index}
              convo={convo}
              otherUsers={others}
              type={type}
              onSwipeStart={onSwipeStart}
              onSwipeEnd={onSwipeEnd}
            />
          );
        })}
      </div>
    );
  }
  return null;
});