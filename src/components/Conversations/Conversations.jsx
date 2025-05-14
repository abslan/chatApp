// import {GrAddCircle} from "react-icons/gr";
import { MdAddCircleOutline} from "react-icons/md";
// import {IoAddCircleOutline} from "react-icons/io"
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react"

import styles from "./Conversations.module.css";
import { dataSelector, dataActions } from "../../redux/reducers/dataReducer";

//chat app todo : add function to render different data types // add styling to  them only user type remains !important

import Header from "./Header";
import DropdownUserCard from "./DropdownUserCard";
import ConversationList from "./ConversationList";


export default function Conversations(){
    const {conversations_duo, conversations_groups, users, session_details} = useSelector(dataSelector);
    // const current_user_id = "taylorswift";
    const {theme} = session_details;
    const current_user_id = session_details["current_user_details"]["id"]
    const current_user = users[current_user_id];

    const dispatch = useDispatch();

    // const handleCardClick = (event, data) => {
    //     dispatch(dataActions.handleCardClick(data))
    // }

    const handleNewDuoConvo = (e, friend_id) => {
        dispatch(dataActions.openDuo({friend_id}))

    }

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

    return (
        <div className={theme === "dark" ? `${styles.conversations_container} ${  styles.dark_theme}` : `${styles.conversations_container}`}>
            <Header title="CONVERSATIONS">
                <div className={styles.dropdown_container}>
                    <MdAddCircleOutline className={styles.add_btn} size={20}/>
                    <div className={styles.dropdown_content}>
                        {
                            Object.keys(users)
                                .filter((id) => id!==current_user_id)
                                .map((user_id, index)=>{
                                    const user = users[user_id];
                                    return <DropdownUserCard key={index} user={user} onClick={(e) => handleNewDuoConvo(e,user_id)} />
                            })
                        }
                    </div>
                </div>
            </Header>
            <ConversationList
                current_user_convo_list={current_user.conversations_duo}
                convo_list={conversations_duo}
                users={users}
                currentUserId={current_user_id}
                onSwipeStart={handleSwipeStart}
                onSwipeEnd={handleSwipeEnd}
                type="duo"
            />
            <Header title="GROUPS" />
            <ConversationList
                current_user_convo_list={current_user.conversations_groups}
                convo_list={conversations_groups}
                users={users}
                currentUserId={current_user_id}
                onSwipeStart={handleSwipeStart}
                onSwipeEnd={handleSwipeEnd}
                type="group"
            />
        </div>
    )
}