import {MdOutlineUnfoldMore} from "react-icons/md";

import styles from './Conversations.module.css';
import LastMessage from './LastMessage';
import { formatTimestamp, truncate, formatImageSource, dataActions,fetchUserPreviewsThunk } from '../../redux/reducers/dataReducer';

import { useGroupOnlineStatus } from "../../firebase_files/realtimeUtils";
import { memo, useState, useEffect } from "react";

import {useDispatch, useSelector} from "react-redux";

//  chatapp todo use selectors for getting user details
export const ConversationItem = memo(({ convo, otherUsersIds, type, 
  // handleSwipeStart, handleSwipeEnd
 }) =>  {

    const dispatch = useDispatch()

    const [startX, setStartX] = useState(null);

    const handleSwipeStart = (event, data) => {
        event.stopPropagation();
        event.preventDefault();
        if (event.type === 'mousedown') {
        setStartX(event.clientX);
        } else if (event.type === 'touchstart') {
        setStartX(event.touches[0].clientX);
        }
    };

    const handleSwipeEnd = (event, data) => {
        //chatapp todo need id and 
        event.stopPropagation();
        event.preventDefault();
        if (startX === null) return;

        const currentX = event.type === 'mouseup' ? event.clientX : event.changedTouches[0].clientX;
        const deltaX = currentX - startX;

        const ele = event.currentTarget
        const {type, id} = data

        // console.log(deltaX)
        if( deltaX === 0){
            dispatch(dataActions.handleCardClick({type, id}))
        }
        else if (-100 <= deltaX && deltaX < -50) {
            //chatapp todo add fade out animation
            if(ele.classList.contains(styles.fade_out_animation)){
                ele.classList.toggle((styles.fade_out_animation))
            }  
            if(!ele.classList.contains(styles.fade_out_center_animation)){
                ele.classList.toggle((styles.fade_out_center_animation))
            }    
        }
        else if (deltaX < -100) {
            //chatapp todo add visible in data & set and remove
            if(ele.classList.contains(styles.fade_out_center_animation)){
                ele.classList.toggle((styles.fade_out_center_animation))
            }  
            if(!ele.classList.contains(styles.fade_out_animation)){
                ele.classList.toggle((styles.fade_out_animation))

                setTimeout(() => dispatch(dataActions.hideCard({type, id})), 3000)
            }        
        }
        setStartX(null);
    };


  console.log("convo items rendered ", otherUsersIds)
  const { anyOnline } = useGroupOnlineStatus(otherUsersIds);
  const last = convo.last_message//?.length > 0 ?  convo.messages[convo.messages.length - 1] : null;
  // console.log("anyonline", anyOnline)
  // console.log("lasstmessage", last, convo.last_message)

  //fetch other members of convo previews
  // const selectUsersPreviewByIds = useMemo(makeSelectUsersPreviewByIds, []);
  // const otherUsers = useSelector(state => selectUsersPreviewByIds(state, otherUsersIds));

  
  useEffect(()=> {
        dispatch(fetchUserPreviewsThunk(otherUsersIds))
         // eslint-disable-next-line 
    }, [] )

    const allUsersPreviews = useSelector(state => state.dataReducer.usersPreviews);
    // console.log("convo item all user previews", allUsersPreviews)
    const otherUsers = otherUsersIds.map( id => allUsersPreviews[id]).filter(Boolean)
    console.log("convo item user previews", otherUsers)



  // console.log("convo items rendered otherusers", otherUsers)
  // convo_id,  convo_name, convo_type, convo_users preview (other than current, only 2 needed), and online status last message of convo
  // can fetch all these from convo id and type, and swipe wet , and need current user id to get


  console.log(`convo item ${convo?.id}`, otherUsers)

  if(otherUsersIds.length !== otherUsers.length){
    return null
  }

  return (
    <div
      className={
        type === 'duo' ? styles.duo_card : styles.groups_card
      }
      onMouseDown={(e) => handleSwipeStart(e, { type, id: convo.id })}
      onTouchStart={(e) => handleSwipeStart(e, { type, id: convo.id })}
      onMouseUp={(e) => handleSwipeEnd(e, { type, id: convo.id })}
      onTouchEnd={(e) => handleSwipeEnd(e, { type, id: convo.id })}
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
            src={formatImageSource(u.img)}
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
          { last?.data && <LastMessage item={last.data} />}
        </div>
      </div>
      <div className={styles.timestamp_container}>
        <div
          style={{ backgroundColor: anyOnline ? //otherUsers.some(u => u.is_online) ? 
            'green' : 'grey' }}
          className={styles.online_status}
        />
        <p className={styles.timestamp}>{last?.timestamp && formatTimestamp(last.timestamp)}</p>
      </div>
    </div>
  );
});