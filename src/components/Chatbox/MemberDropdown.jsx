import styles from './Chatbox.module.css';
import { HiUserAdd, HiUserRemove } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, memo } from 'react';
import { makeSelectUsersPreviewByIds, dataActions } from '../../redux/reducers/dataReducer';

export const  MemberDropdown = memo(({ userIds, convo_id, renderTrigger, onAdd, onRemove }) => {
  const dispatch = useDispatch();

  const selectUsersPreviewByIds = useMemo(makeSelectUsersPreviewByIds, []);
  const usersPreview = useSelector(state => selectUsersPreviewByIds(state, userIds));

  return (
    <div className={styles.dropdown_container}>
      {renderTrigger()}
      <div className={styles.dropdown_content}>
        {usersPreview.map(u => (
          <div key={u.user_id} className={styles.dropdown_user_card}>
            <img src={u.img} alt="" className={styles.dropdown_user_img} />
            <p className={styles.dropdown_user_name}>{u.user_name}</p>
            {onRemove && (
              <HiUserRemove
                size={20}
                className={styles.add_member_btn}
                onClick={() => dispatch(dataActions.removeMember({ user_id: u.user_id , convo_id }))}
              />
            )}
            {onAdd && (
              <HiUserAdd
                size={20}
                className={styles.add_member_btn}
                onClick={() => dispatch(dataActions.addMember({ user_id : u.user_id, convo_id }))}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
})