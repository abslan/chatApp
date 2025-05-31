// import {GrAddCircle} from "react-icons/gr";
import { MdAddCircleOutline} from "react-icons/md";
// import {IoAddCircleOutline} from "react-icons/io"
import {useDispatch, useSelector} from "react-redux";
// import {useState} from "react"

import styles from "./Conversations.module.css";
import { sessionDetailsSelector, dataActions,
    selectUserById, makeSelectUsersPreviewByIds
 } from "../../redux/reducers/dataReducer";

//chat app todo : add function to render different data types // add styling to  them only user type remains !important

import Header from "./Header";
import {ConversationList} from "./ConversationList";
// import { MemberDropdown } from "../Chatbox/MemberDropdown";
import {  useMemo } from "react";
import DropdownUserCard from "./DropdownUserCard";


export default function Conversations(){

    //chatApp todo get conversations details of only users chats, and pass only convo ids list,and type
    // and inside convoList comp, getDetails using selector,  also, load the
    // chatApp todo load conversations details of only users chats from server on initial render and store in redux 
    // const {conversations_duo, conversations_groups, users, session_details} = useSelector(dataSelector);
    // const current_user_id = "taylorswift";
    console.log("conversations rendered")

    const {theme, current_user_details}= useSelector(sessionDetailsSelector);

    const current_user_id = current_user_details.id
    // const current_user = users[current_user_details.id];
    const current_user = useSelector(selectUserById(current_user_id))
    // const current_user_friends = useSelector(selectUserFriends(current_user_id))
    const selectUsersPreviewByIds = useMemo(makeSelectUsersPreviewByIds, []);
    const userFriendsPreview = useSelector(state => selectUsersPreviewByIds(state, current_user.friends));

    const dispatch = useDispatch();

    // const handleCardClick = (event, data) => {
    //     dispatch(dataActions.handleCardClick(data))
    // }

    const handleNewDuoConvo = (e, friend_id) => {
        dispatch(dataActions.openDuo({friend_id}))

    }

    // const renderTriggeAddButton = useCallback(
    //     () => <MdAddCircleOutline className={styles.add_btn} size={20}/>, []
    //   )

    // const [startX, setStartX] = useState(null);

    // const handleSwipeStart = (event, data) => {
    //     event.stopPropagation();
    //     event.preventDefault();
    //     if (event.type === 'mousedown') {
    //     setStartX(event.clientX);
    //     } else if (event.type === 'touchstart') {
    //     setStartX(event.touches[0].clientX);
    //     }
    // };

    // const handleSwipeEnd = (event, data) => {
    //     //chatapp todo need id and 
    //     event.stopPropagation();
    //     event.preventDefault();
    //     if (startX === null) return;

    //     const currentX = event.type === 'mouseup' ? event.clientX : event.changedTouches[0].clientX;
    //     const deltaX = currentX - startX;

    //     const ele = event.currentTarget
    //     const {type, id} = data

    //     // console.log(deltaX)
    //     if( deltaX === 0){
    //         dispatch(dataActions.handleCardClick({type, id}))
    //     }
    //     else if (-100 <= deltaX && deltaX < -50) {
    //         //chatapp todo add fade out animation
    //         if(ele.classList.contains(styles.fade_out_animation)){
    //             ele.classList.toggle((styles.fade_out_animation))
    //         }  
    //         if(!ele.classList.contains(styles.fade_out_center_animation)){
    //             ele.classList.toggle((styles.fade_out_center_animation))
    //         }    
    //     }
    //     else if (deltaX < -100) {
    //         //chatapp todo add visible in data & set and remove
    //         if(ele.classList.contains(styles.fade_out_center_animation)){
    //             ele.classList.toggle((styles.fade_out_center_animation))
    //         }  
    //         if(!ele.classList.contains(styles.fade_out_animation)){
    //             ele.classList.toggle((styles.fade_out_animation))

    //             setTimeout(() => dispatch(dataActions.hideCard({type, id})), 3000)
    //         }        
    //     }
    //     setStartX(null);
    // };

    return (
        <div className={theme === "dark" ? `${styles.conversations_container} ${  styles.dark_theme}` : `${styles.conversations_container}`}>
            <Header title="CONVERSATIONS">
                {/* <MemberDropdown userIds = {current_user.friends} handleNewDuoConvo = {handleNewDuoConvo} renderTrigger={renderTriggeAddButton}/> */}
                <div className={styles.dropdown_container}>
                    <MdAddCircleOutline className={styles.add_btn} size={20}/>
                    <div className={styles.dropdown_content}>
                        {
                            // Object.keys(users)
                            //     .filter((id) => id!==current_user_id)
                            userFriendsPreview
                                .map((user, index)=>{
                                    return <DropdownUserCard key={index} user={user} onClick={(e) => handleNewDuoConvo(e,user.user_id)} />
                            })
                        }
                    </div>
                </div>
            </Header>
            <ConversationList
                current_user_convo_list={current_user.conversations_duo}
                // convo_list={conversations_duo}
                // users={users}
                currentUserId={current_user_id}
                // onSwipeStart={handleSwipeStart}
                // onSwipeEnd={handleSwipeEnd}
                type="duo"
            />
            <Header title="GROUPS" />
            <ConversationList
                current_user_convo_list={current_user.conversations_groups}
                // convo_list={conversations_groups}
                // users={users}
                currentUserId={current_user_id}
                // onSwipeStart={handleSwipeStart}
                // onSwipeEnd={handleSwipeEnd}
                type="group"
            />
        </div>
    )
}