import {ConversationItem} from './ConversationItem';
import styles from './Conversations.module.css';
import { memo , useMemo} from 'react';
import { useSelector } from 'react-redux';

import { makeSelectConvosMetaDataPreview } from '../../redux/reducers/dataReducer';

export const ConversationList = memo(({  current_user_convo_list, currentUserId, type ,
  // convo_list, users,
  //  onNewDuo, onSwipeStart, onSwipeEnd
  }) => {

  console.log("convo list rendered")
  
  // current_user_convo_list,
  // need to pass, ids and type enough i guess 
  const selectConvosMetaDataPreview = useMemo(() => makeSelectConvosMetaDataPreview(current_user_convo_list, type), [current_user_convo_list, type]);
  const convo_previews_list = useSelector(selectConvosMetaDataPreview)


  if (type) {
    return (
      <div className={
            type === 'duo' ? styles.duo_container : styles.groups_container
        }>
        {convo_previews_list.map((convo, index)  => {
          if (!convo.visible_for.includes(currentUserId)) return null;
          const others = convo.user_ids.filter(i => i !== currentUserId)//.map(i => users[i]).sort();
          return (
            <ConversationItem
              key={convo.id}
              convo={convo}
              otherUsersIds={others}
              type={type}
              // onSwipeStart={onSwipeStart}
              // onSwipeEnd={onSwipeEnd}
            />
          );
        })}
        {/* {current_user_convo_list.map((id, index)  => {
          const convo = convo_list[id];
        //  chatapp todo use selectors for getting covo 
          if (!convo.visible_for.includes(currentUserId)) return null;
          const others = convo.user_ids.filter(i => i !== currentUserId).map(i => users[i]).sort();
          return (
            <ConversationItem
              key={index}
              convo={convo}
              otherUsers={others}
              type={type}
              // onSwipeStart={onSwipeStart}
              // onSwipeEnd={onSwipeEnd}
            />
          );
        })} */}
      </div>
    );
  }
  return null;
});