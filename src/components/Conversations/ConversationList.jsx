import {ConversationItem} from './ConversationItem';
import styles from './Conversations.module.css';
import { memo , useMemo, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeSelectConvosMetaDataPreview } from '../../redux/reducers/dataReducer';
import { fetchMultipleConvoMeta, sessionDetailsSelector } from '../../redux/reducers/dataReducer';

export const ConversationList = memo(({  current_user_convo_list, currentUserId, type
  }) => {


  const {conversationsMetaLoading}= useSelector(sessionDetailsSelector);

    console.log("convo list rendered", conversationsMetaLoading)

  //chatApp todo, fetch preview of convos from ids in current_user_convo_list
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMultipleConvoMeta({ convoIds: current_user_convo_list, convoType: type }));
  }, [current_user_convo_list, type, dispatch]);

  
  //chatApp todo, fetch userpreviews from firestore for non-friends of user from convo_list convos, 
  // current_user_convo_list,
  // need to pass, ids and type enough i guess 
  const selectConvosMetaDataPreview = useMemo(() => makeSelectConvosMetaDataPreview(current_user_convo_list, type), [current_user_convo_list, type]);
  const convo_previews_list = useSelector(selectConvosMetaDataPreview)



  if (!type || conversationsMetaLoading > 0) return null;

   console.log("convo preview list", convo_previews_list)
    
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
            />
          );
        })}
      </div>
    );
  
});