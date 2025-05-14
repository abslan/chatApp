import { useDispatch } from 'react-redux';
import { MdOutlineExpandMore, MdAddCircleOutline } from 'react-icons/md';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import styles from './Chatbox.module.css';


import MemberDropdown from './MemberDropdown';
import { dataActions, truncate } from '../../redux/reducers/dataReducer';

export default function ChatHeader({ convo, users, currentUserId, type }) {

  const dispatch = useDispatch();


  const otherUsers = type === 'group'
    ? convo.user_ids.filter(id => id !== currentUserId).map(id => users[id])
    : users[convo.user_ids.find(id => id !== currentUserId)];
    

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
                src={otherUsers.img}
                alt=""
              />
            )}
        {type === 'group' && <MdOutlineExpandMore size={20} className={styles.groups_user_img_more} />}
      </div>

      {/* Conversation Title */}
      <div className={styles.group_info}>
        <span className={styles.user_names}>
          {type === 'group'
            ? (convo.name || truncate(otherUsers.map(u => u.user_name).join(", "),30) )
            : truncate(otherUsers.user_name, 25)}
        </span>
        
        {/* Info Dropdown for Group Members */}
        {type === 'group' && (
          <MemberDropdown
            users={otherUsers}
            onRemove={user => dispatch(dataActions.removeMember({ user_id: user.id, convo_id: convo.id }))}
            renderTrigger={() => <HiOutlineInformationCircle size={20} className={styles.info_btn} />}
          />
        )}

      </div>

    

      {/* Add Member Dropdown for Group */}
      {type === 'group' && (
        <MemberDropdown
          users={users[currentUserId].friends
            .filter(id => !convo.user_ids.includes(id))
            .map(id => users[id])}
          onAdd={user => dispatch(dataActions.addMember({ user_id: user.id, convo_id: convo.id }))}
          renderTrigger={() => <MdAddCircleOutline size={20} className={styles.add_users} />}
        />
      )}
    </div>
  );
}