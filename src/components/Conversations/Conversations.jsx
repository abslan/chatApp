// import {GrAddCircle} from "react-icons/gr";
import { MdAddCircleOutline} from "react-icons/md";
// import {IoAddCircleOutline} from "react-icons/io"
import {useDispatch, useSelector} from "react-redux";
// import {useState} from "react"

import styles from "./Conversations.module.css";
import { sessionDetailsSelector, dataActions,
    selectUserById
 } from "../../redux/reducers/dataReducer";

//chat app todo : add function to render different data types // add styling to  them only user type remains !important

import Header from "./Header";
import {ConversationList} from "./ConversationList";
// import { MemberDropdown } from "../Chatbox/MemberDropdown";
import {  useEffect } from "react";
import DropdownUserCard from "./DropdownUserCard";

import { fetchUserPreviewsThunk } from "../../redux/reducers/dataReducer";


export default function Conversations(){

    //chatApp todo get conversations details of only users chats, and pass only convo ids list,and type
    // and inside convoList component, getDetails using selector,  also, load the
    // chatApp todo load conversations details of only users chats from server on initial render and store in redux 
    // const {conversations_duo, conversations_groups, users, session_details} = useSelector(dataSelector);
    // const current_user_id = "taylorswift";
    console.log("conversations rendered")

     const dispatch = useDispatch();



    //GETTING CURRENT USER DETAILS FROM SESSION
    const {theme, current_user_details}= useSelector(sessionDetailsSelector);
    const current_user_id = current_user_details.id
    // const current_user = users[current_user_details.id];
    const current_user = useSelector(selectUserById(current_user_id))
    console.log("conerations current user", current_user)

    
    // getting user friends previews to load in duo convo dropdown 
    // const selectUsersPreviewByIds = useMemo(makeSelectUsersPreviewByIds, []);
    // const userFriendsPreview = useSelector(state => selectUsersPreviewByIds(state, current_user.friends));

    //fetch user Preview from firestore
    useEffect(()=> {
        dispatch(fetchUserPreviewsThunk(current_user.friends))
    }, [dispatch, current_user.friends])

    const allUsersPreviews = useSelector(state => state.dataReducer.usersPreviews);
    console.log("coversations all user previews", allUsersPreviews)
    const userFriendsPreview = current_user.friends.map( id => allUsersPreviews[id]).filter(Boolean); 
    console.log("coversations user previews", userFriendsPreview, current_user)

    const usersPreviewsLoading = useSelector(state => state.dataReducer.usersPreviewsLoading);
    if (usersPreviewsLoading || userFriendsPreview.length !== current_user.friends.length){
        //chatApp todo implement fallback UI 
        return <div>Loading....</div>
    }

    // const handleCardClick = (event, data) => {
    //     dispatch(dataActions.handleCardClick(data))
    // }

    const handleNewDuoConvo = (e, friend_id) => {
        dispatch(dataActions.openDuo({friend_id}))

    }

    // const renderTriggeAddButton = useCallback(
    //     () => <MdAddCircleOutline className={styles.add_btn} size={20}/>, []
    //   )



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
                currentUserId={current_user_id}
                type="duo"
            />
            <Header title="GROUPS" />
            <ConversationList
                current_user_convo_list={current_user.conversations_groups}
                currentUserId={current_user_id}
                type="group"
            />
        </div>
    )
}