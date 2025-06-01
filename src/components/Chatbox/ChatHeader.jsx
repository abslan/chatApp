import { useSelector } from 'react-redux';
import { MdOutlineExpandMore, MdAddCircleOutline } from 'react-icons/md';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import styles from './Chatbox.module.css';


import { MemberDropdown } from './MemberDropdown';
import { truncate, selectConvoUserIds, selectSessionUserId, selectConvoName,
   selectUserFriends, formatImageSource, 
   fetchUserPreviewsThunk} from '../../redux/reducers/dataReducer';
import { useMemo, useCallback, memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const ChatHeader = memo(({ convo_id, type }) => {

  const dispatch = useDispatch();
  const renderTriggerInfoButton = useCallback(
    () => <HiOutlineInformationCircle size={20} className={styles.info_btn} />, []
  )

  const renderTriggerAddButton = useCallback(
    () => <MdAddCircleOutline size={20} className={styles.add_users} />, []
  );

  // const convo_id = null;

  //selectors
  const currentUserId = useSelector(selectSessionUserId);
  const currentUserFriends = useSelector(selectUserFriends(currentUserId));

  //chatApp todo  fetch userIDs of members of  convo or convo meta deta is needed to be fetched and cached
  //Need to be done in parent component only 
  const convoUserIds = useSelector(selectConvoUserIds(convo_id, type));
  // const otherUserIds = convoUserIds.filter(id => id !== currentUserId);
  console.log("chatheader:", convoUserIds)
  const otherUserIds = useMemo(() => convoUserIds.filter(id => id !== currentUserId), [convoUserIds, currentUserId]);
  const currentUserFriendsinConvo = useMemo(() => currentUserFriends.filter(id => !convoUserIds.includes(id)), [currentUserFriends, convoUserIds]);
  

  const convoName = useSelector(state => type === 'group' ? selectConvoName(convo_id)(state) : null);



  //getting userpreviews for members in chat 
  // const selectOtherUsers = useMemo(() => {
  //   if (type === 'group') {
  //     return makeSelectUsersByIds(otherUserIds);
  //   } else {
  //     return makeSelectUserById(otherUserIds[0]); // 1:1 chat
  //   }
  // }, [type, otherUserIds]);
  // const otherUsers = useSelector(selectOtherUsers);

  //fetching user previews of chat, getting from state cache if already fetched
  useEffect(()=> {
      dispatch(fetchUserPreviewsThunk(otherUserIds))
  }, [dispatch, otherUserIds])

  const allUsersPreviews = useSelector(state => state.dataReducer.usersPreviews);
  console.log("chatbox all user previews", allUsersPreviews)
  const otherUsers = otherUserIds.map( id => allUsersPreviews[id]).filter(Boolean); 
  console.log("chatbox other users previews", otherUsers)

  const usersPreviewsLoading = useSelector(state => state.dataReducer.usersPreviewsLoading);
  if (usersPreviewsLoading || otherUsers.length !== otherUserIds.length){
    //chatApp todo implement fallback UI 
    return <div>Loading....</div>
  }
    

  return (
    <div className={type === 'group' ? styles.header : styles.header2}>
      {/* User Avatars */}
      <div className={styles.groups_user_img_container}>
        {type === 'group'
          ? otherUsers.slice(0, 3).map(user => (
              <img key={user.id} className={styles.groups_user_img} src={formatImageSource(user.img)} alt="" />
            ))
          : (
              <img
                className={styles.groups_user_img}
                src={formatImageSource(otherUsers[0].img)}
                alt=""
              />
            )}
        {type === 'group' && <MdOutlineExpandMore size={20} className={styles.groups_user_img_more} />}
      </div>

      {/* Conversation Title */}
      <div className={styles.group_info}>
        <span className={styles.user_names}>
          {type === 'group'
            ? (convoName || truncate(otherUsers.map(u => u.user_name).join(", "),30) )
            : truncate(otherUsers[0].user_name, 25)}
        </span>
        
        {/* Info Dropdown for Group Members */}
        {type === 'group' && (
          <MemberDropdown
            userIds={otherUserIds}
            // onRemove={user_id => dispatch(dataActions.removeMember({ user_id, convo_id }))}
            renderTrigger={renderTriggerInfoButton}
            convo_id = {convo_id}
            onRemove={true}
          />
        )}

      </div>

    

      {/* Add Member Dropdown for Group */}
      {type === 'group' && (
        <MemberDropdown
          userIds={currentUserFriendsinConvo}
          // {currentUserFriends
          //   .filter(id => !convoUserIds.includes(id))
          // }
          // onAdd={user_id => dispatch(dataActions.addMember({ user_id , convo_id}))}
          renderTrigger={renderTriggerAddButton}
          convo_id = {convo_id}
          onAdd={true}
        />
      )}
    </div>
  );
})