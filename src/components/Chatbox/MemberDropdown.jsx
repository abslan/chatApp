import styles from './Chatbox.module.css';
import { HiUserAdd, HiUserRemove } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import {  memo, useEffect } from 'react';
import { fetchUserPreviewsThunk, dataActions } from '../../redux/reducers/dataReducer';
import DropdownUserCard from '../Conversations/DropdownUserCard';

export const  MemberDropdown = memo(({ userIds, convo_id, renderTrigger, onAdd, onRemove, handleNewDuoConvo }) => {
  const dispatch = useDispatch();
  //chatApp todo here userPreview need to be rewrritten since state of previews isnow in userPreviews
  // const selectUsersPreviewByIds = useMemo(makeSelectUsersPreviewByIds, []);
  // const usersPreview = useSelector(state => selectUsersPreviewByIds(state, userIds));

   // getting user previews to load in member dropdown 
    useEffect(()=> {
        dispatch(fetchUserPreviewsThunk(userIds))
    }, [dispatch, userIds])

    //chatapp todo userpreviews createSelect selectors needs to be written
    const allUsersPreviews = useSelector(state => state.dataReducer.usersPreviews);
    console.log("coversations all user previews", allUsersPreviews)
    const usersPreview = userIds.map( id => allUsersPreviews[id]).filter(Boolean); 
    console.log("coversations user previews", usersPreview)

  if(userIds.length !== usersPreview.length){
    return null
  }
  

  return (
    <div className={styles.dropdown_container}>
      {renderTrigger()}
      <div className={styles.dropdown_content}>
        {usersPreview.map(u => (
          <DropdownUserCard key={u.user_id} user = {u}  
            {...(handleNewDuoConvo && { onClick: (e) => handleNewDuoConvo(e, u.user_id), })}>

              
            {onRemove && (<HiUserRemove size={20}
                className={styles.add_member_btn}
                onClick={() => dispatch(dataActions.removeMember({ user_id: u.user_id , convo_id }))}/>
            )}
            {onAdd && (<HiUserAdd size={20}
                className={styles.add_member_btn}
                onClick={() => dispatch(dataActions.addMember({ user_id : u.user_id, convo_id }))}/>
            )}
          </DropdownUserCard>
        ))}
      </div>
    </div>
  );
})