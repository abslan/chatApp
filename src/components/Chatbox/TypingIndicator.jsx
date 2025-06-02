import styles from './Chatbox.module.css';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectSessionUserId } from '../../redux/reducers/dataReducer';

export const TypingIndicator = memo(({ typingList }) => {
  // Show up to 2 other users typing
  console.log("typing list render", typingList)

  const currentUserId = useSelector(selectSessionUserId);

  const typingListUsersPreview = useSelector((state) => {
      return typingList.slice(0,2).map( id => {
          if(id !== currentUserId) {
              return state.dataReducer.usersPreviews[id]
          }else {
              return state.dataReducer.users[currentUserId]
          }
        })
      } 
    );
  
  console.log("typing List users preview", typingListUsersPreview)
  // return null
  if (!Array.isArray(typingList) || typingListUsersPreview?.length === 0){
    return null
  }

  return (
    <div className={styles.typing_indicator}>
      {typingListUsersPreview
        // .filter(item => item.user_id !==  null)//currentUserId)
        // .slice(0, 2)
        .map(item => (
          <div key={item.user_id} className={styles.typing_indicator_item}>
            <p>{item.user_name}</p>
            <div className={styles.typing_dot}></div>
            <div className={styles.typing_dot}></div>
            <div className={styles.typing_dot}></div>
          </div>
        ))}
    </div>
  );
})