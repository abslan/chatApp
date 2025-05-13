// import {GrAddCircle} from "react-icons/gr";
import {MdOutlineUnfoldMore, MdAddCircleOutline} from "react-icons/md";
// import {IoAddCircleOutline} from "react-icons/io"
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react"

import styles from "./Conversations.module.css";
import { dataSelector, truncate, dataActions, formatTimestamp } from "../../redux/reducers/dataReducer";

//chat app todo : add function to render different data types // add styling to  them only user type remains !important



function LastMessage({item}){
    switch (item.type) {
        case 'image':
        //   return <img className={styles.last_message_img} src={item.value} alt=""/>;
            // return <p className={styles.last_message_img}>{item.value}</p>
            return <p></p>
  
        case 'link':
          return (
            <a className={styles.last_message_link}  href={item.value} target="_blank" rel="noopener noreferrer">
              {item.label || 'Visit Link'}
            </a>
          );
  
        case 'text':
          return <p className={styles.data_text} >{truncate(item.value, 20)}</p>;

        case 'user':
            return <p className={styles.data_user} >{item.value}</p>;

        case 'group':
            return <p className={styles.data_group} >{item.value}</p>;
  
        default:
          return null;
      }

}

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
            <div className={styles.header}>
                <h5 className={styles.title}>CONVERSATIONS</h5>
                <div className={styles.dropdown_container}>
                    <MdAddCircleOutline className={styles.add_btn} size={20}/>
                    <div className={styles.dropdown_content}>
                        {
                            Object.keys(users).filter((id) => id!==current_user_id).map((user_id, index)=>{
                                const user = users[user_id];
                                return (
                                <div className={styles.dropdown_user_card} key={index} onClick={(e) => handleNewDuoConvo(e, user_id)}>
                                    <img className={styles.dropdown_user_img} src={user.img} alt=""/>
                                    <p className={styles.dropdown_user_name}>{user.user_name}</p>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles.duo_container}>
                {
                    current_user.conversations_duo.map((id, index) => {
                        const convo = conversations_duo[id];
                        if( !convo.visible_for.includes(current_user_id)){
                            return null
                        }
                        const second_user_id = convo.user_ids.filter((item) => item!==current_user_id)[0];
                        const second_user = users[second_user_id];
                        return (
                            <div 
                                onMouseDown={(e) => handleSwipeStart(e, {type: "duo", id: id})}
                                onTouchStart={(e) => handleSwipeStart(e, {type: "duo", id: id})}
                                onMouseUp={(e) => handleSwipeEnd(e, {type: "duo", id: id})}
                                onTouchEnd={(e) => handleSwipeEnd(e, {type: "duo", id: id})}

                                // onClick={(e) => handleCardClick(e, {type: "duo", id: id})}
                                className={styles.duo_card} key={index} >

                                    <div className={styles.card_overlay}></div>
                                    <img className={styles.duo_user_image} src={second_user.img} alt=""/>
                                    <div className={styles.user_details}>
                                        <p className={styles.user_name}>{second_user.user_name}</p>
                                        <div className={styles.last_message}>
                                        {convo.messages.length > 0 ? <LastMessage item={convo.messages[convo.messages.length-1].data}/> : null}
                                        </div>
                                    </div>
                                    <div className={styles.timestamp_container}>
                                        <div  style={{backgroundColor : second_user.is_online ? "green": "grey"}} className={styles.online_status} ></div>
                                        <p className={styles.timestamp} >
                                            {convo.messages.length > 0 ? formatTimestamp(convo.messages[convo.messages.length-1].timestamp) : null}
                                            {/* {formatTimestamp(convo.messages[convo.messages.length-1].timestamp)} */}
                                        </p>
                                    </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.header}>
                <h5 className={styles.title}>GROUPS</h5>
                <MdAddCircleOutline className={styles.add_btn} size={20}/>
            </div>
            <div className={styles.groups_container}>
            {
                    current_user.conversations_groups.map((id, index) => {
                        const convo = conversations_groups[id];
                        if(!convo.visible_for.includes(current_user_id)){
                            return null
                        }
                        const group_user_ids = convo.user_ids.filter((item) => item!==current_user_id);
                        // console.log(group_user_ids);
                        return (
                        <div
                            onMouseDown={(e) => handleSwipeStart(e,  {type: "group", id: id})}
                            onTouchStart={(e) => handleSwipeStart(e,  {type: "group", id: id})}
                            onMouseUp={(e) => handleSwipeEnd(e,  {type: "group", id: id})}
                            onTouchEnd={(e) => handleSwipeEnd(e,  {type: "group", id: id})}
                            // onClick={(e) => handleCardClick(e, {type: "group", id: id})}
                            className={styles.groups_card}  key={index} >

                            <div className={styles.card_overlay}></div>
                            <div className={styles.groups_user_img_container}>
                                <img className={styles.groups_user_img} src={users[group_user_ids[0]].img} alt=""/>
                                <img className={styles.groups_user_img} src={users[group_user_ids[1]].img} alt=""/>
                                <MdOutlineUnfoldMore size={20} className={styles.groups_user_img_more}/>
                            </div>
                            <div className={styles.user_details}>
                                <p className={styles.user_name}>{convo.name ? convo.name : truncate(group_user_ids.map((id) => users[id].user_name).join(","), 16)}</p>
                                <div className={styles.last_message}>
                                    <LastMessage item={convo.messages[convo.messages.length-1].data}/>
                                </div>
                            </div>
                            <div className={styles.timestamp_container}>
                                <div  style={{backgroundColor : group_user_ids.map((id) => users[id].is_online).length > 0 ? "green": "grey"}} className={styles.online_status} ></div>
                                <p className={styles.timestamp} >{formatTimestamp(convo.messages[convo.messages.length-1].timestamp)}</p>
                            </div>
                        </div>)
                    })
                }

            </div>
        </div>
    )
}