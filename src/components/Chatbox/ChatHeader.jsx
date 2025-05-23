import { useSelector } from 'react-redux';
import { MdOutlineExpandMore, MdAddCircleOutline } from 'react-icons/md';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import styles from './Chatbox.module.css';


import { MemberDropdown } from './MemberDropdown';
import { truncate, selectConvoUserIds, selectSessionUserId, selectConvoName,
   selectUserFriends, makeSelectUserById, makeSelectUsersByIds, formatImageSource } from '../../redux/reducers/dataReducer';
import { useMemo, useCallback, memo } from 'react';

export const ChatHeader = memo(({ convo_id, type }) => {

  // const dispatch = useDispatch();

  // const convo_id = null;

  //selectors
  const currentUserId = useSelector(selectSessionUserId);
  const currentUserFriends = useSelector(selectUserFriends(currentUserId));

  const convoUserIds = useSelector(selectConvoUserIds(convo_id, type));
  // const otherUserIds = convoUserIds.filter(id => id !== currentUserId);
  console.log("chatheader:", convoUserIds)
  const otherUserIds = useMemo(() => convoUserIds.filter(id => id !== currentUserId), [convoUserIds, currentUserId]);
  const currentUserFriendsinConvo = useMemo(() => currentUserFriends.filter(id => !convoUserIds.includes(id)), [currentUserFriends, convoUserIds]);
  
  // const otherUsers = useSelector(state => {
  //   if (type === 'group') {
  //     return selectUsersByIds(otherUserIds)(state);
  //   } else {
  //     const otherUserId = otherUserIds[0]; // 1:1 chat
  //     return selectUserById(otherUserId)(state);
  //   }
  // });
  const selectOtherUsers = useMemo(() => {
    if (type === 'group') {
      return makeSelectUsersByIds(otherUserIds);
    } else {
      return makeSelectUserById(otherUserIds[0]); // 1:1 chat
    }
  }, [type, otherUserIds]);
  const otherUsers = useSelector(selectOtherUsers);

  const convoName = useSelector(state => type === 'group' ? selectConvoName(convo_id)(state) : null);


  const renderTriggerInfoButton = useCallback(
    () => <HiOutlineInformationCircle size={20} className={styles.info_btn} />, []
  )

  const renderTriggerAddButton = useCallback(
    () => <MdAddCircleOutline size={20} className={styles.add_users} />, []
  );

    

  return (
    <div className={type === 'group' ? styles.header : styles.header2}>
      {/* User Avatars */}
      <div className={styles.groups_user_img_container}>
        {type === 'group'
          ? otherUsers.slice(0, 3).map(user => (
              <img key={user.id} className={styles.groups_user_img} src={user.img} alt="" />
            ))
          : (
              <img
                className={styles.groups_user_img}
                src={formatImageSource(otherUsers.img)}
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
            : truncate(otherUsers.user_name, 25)}
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