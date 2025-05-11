import {GrAddCircle} from "react-icons/gr";
import { MdOutlineExpandMore, MdOutlineAttachFile} from "react-icons/md"
import {HiUserAdd, HiUserRemove, HiOutlineInformationCircle} from "react-icons/hi";
import {FiSend} from "react-icons/fi";
// import {BiSolidUserCheck} from "react-icons/bi";
import {useDispatch, useSelector} from "react-redux";


import {useState, useEffect, useRef}  from "react"


import styles from "./Chatbox.module.css"
import { dataSelector, truncate, dataActions, formatTimestamp } from "../../redux/reducers/dataReducer";


function RenderData({item}){
    switch (item.type) {
        case 'image':
            return <img className={styles.data_img} src={item.value} alt={String(item.value)} />;

        case 'link':
            return (
                <a className={styles.data_link}  href={item.value} target="_blank" rel="noopener noreferrer">
                {item.label || 'Visit Link'}
                </a>
            );

        case 'text':
            return <p className={styles.data_text} >{item.value}</p>;

        case 'user':
            return <p className={styles.data_user} >{item.value}</p>;

        case 'group':
            return <p className={styles.data_group} >{item.value}</p>;


        default:
            return null;
    }
}

export default function Chatbox(){
    //we need only one conversation 
    // const [newMembers, setNewMembers] = useState([]);
    const {conversations_duo, conversations_groups, users, session_details} = useSelector(dataSelector);
    const dispatch = useDispatch();

    // const [typingStatus, setTypingStatus] = useState('idle');
    const [timeoutId, setTimeoutId] = useState(null);
    const [finishTimeoutId, setFinishTimeoutId] = useState(null);
    const inputRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    const {theme} = session_details;
    const convo_id  = session_details["current_convo_details"]["id"]
    const convo_type = session_details["current_convo_details"]["type"]
    const current_user_id = session_details["current_user_details"]["id"]
    const convo = convo_type === "group" ? conversations_groups[convo_id] : conversations_duo[convo_id];
    const current_user = users[current_user_id];
    

    useEffect(() => {
        return () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        };
    }, [timeoutId]);

    useEffect(() => {
        scrollToBottom();
    }, [conversations_duo, conversations_groups]);



    function sendMessage( data , type = "text"){
        if(type === "text"){
            if(inputRef.current.value===""){
                console.log("empty message")
                //chat app todo alert in chatbox
                return
            }
            dispatch(dataActions.addMessage({data: inputRef.current.value, type: type}));
            inputRef.current.value = "";
        }
        //chat app todo handle other message types 
    }

    const scrollToBottom = () => {
        const messagesContainer = messagesContainerRef.current;
        // console.log("scroll",  messagesContainer.scrollTop , messagesContainer.scrollHeight)
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      };

    const handleKeyDown = (event) => {


        clearTimeout(timeoutId);
        clearTimeout(finishTimeoutId);

        // console.log("dis 1", inputRef.current.value)
        if (event.key === 'Enter') {
            dispatch(dataActions.handleTyping({ status: "finished"}))
            sendMessage();
            return
        } 

         // setTypingStatus('typing');
         const store_typing_status = convo.typing.filter(item => item.user_id === current_user_id)
         if(store_typing_status.length===0){
             dispatch(dataActions.handleTyping({ status: "typing"}))
             // console.log("not yet in store")
            //  return
         }else if(store_typing_status[0].status!=="typing"){
            dispatch(dataActions.handleTyping({ status: "typing"}))
        }

        const newTimeoutId = setTimeout(() => {
            dispatch(dataActions.handleTyping({ status: "idle"}))
        }, 1000); 
        clearTimeout(timeoutId);
        setTimeoutId(newTimeoutId);

        const newTimeoutId2 = setTimeout(() => {
            // setTypingStatus('finished');
            dispatch(dataActions.handleTyping({ status: "finished"}))
        }, 3000);
        clearTimeout(finishTimeoutId);
        setFinishTimeoutId(newTimeoutId2);



    };

    const handleSend = (event) => {
        clearTimeout(timeoutId);
        clearTimeout(finishTimeoutId);

        dispatch(dataActions.handleTyping({ status: "finished"}))
        sendMessage();

    }

    const handleAttachmentClick = () => {
        //chat app todo upload image
        return
        // fileInputRef.current.click();
      };
    
    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        console.log("file", file)
        
        // chat app todo Upload the image to cloud storage service
        // const imageURL = await uploadImageToCloudStorage(file); // Implement this function
    
        // Dispatch action to store image URL in Redux state
        // dispatch(addImage(imageURL));
      };


    return convo_id === null ? (
        <div className={theme === "dark" ? `${styles.chatbox} ${  styles.dark_theme}` : `${styles.chatbox}`}>
        </div>
    )
    
    : 
    (
        <div className={theme === "dark" ? `${styles.chatbox} ${  styles.dark_theme}` : `${styles.chatbox}`}>
            <div className={convo_type === "group" ? styles.header: styles.header2}>
                <div className={ styles.groups_user_img_container}>
                    {
                        convo_type === "group" ?
                        convo.user_ids.slice(0, convo.user_ids.length> 2 ? 3: 2).map((user_id, index) => {
                            const user = users[user_id];
                            return <img key ={user.user_name} className={styles.groups_user_img} src={user.img} alt=""/>
                        }) : convo.user_ids.filter(user_id => user_id!==current_user_id).map((user_id, index) => {
                            const user = users[user_id];
                            return <img key ={user.user_name} className={styles.groups_user_img} src={user.img} alt=""/>
                        })

                    }
                    {/* <img className={styles.groups_user_img} src={users[group_user_ids[0]].img} alt=""/> */}
                    {convo_type === "group" ? <MdOutlineExpandMore size={20} className={styles.groups_user_img_more}/> : null}
                </div>
                <div className={styles.group_info}>
                    {convo_type === "group" ?  
                        <span className={styles.user_names}>{convo.name ?  convo.name : truncate(convo.user_ids.map((id) => users[id].user_name).join(","), 30)}</span> :
                        <span className={styles.user_names}>{truncate(users[convo.user_ids.filter((id) => id!==current_user_id)[0]].user_name, 25)}</span>
                    }
                    {convo_type ==="group" ? 
                    
                    <div className={styles.dropdown_container}>
                        <HiOutlineInformationCircle size={20} className={styles.info_btn}/>
                        <div className={styles.dropdown_content}>
                            {
                                convo.user_ids.filter((id) => id!==current_user_id).map((user_id, index)=>{
                                    const user = users[user_id];
                                    return (
                                    <div className={styles.dropdown_user_card} key={index}>
                                        <img className={styles.dropdown_user_img} src={user.img} alt=""/>
                                        <p className={styles.dropdown_user_name}>{user.user_name}</p>
                                        <HiUserRemove size={20} className={styles.add_member_btn} onClick={()=> dispatch(dataActions.removeMember({user_id: user_id, convo_id: convo_id}))} />
                                    </div>)
                                })
                            }
                        </div>
                    </div> : null}
                </div>
                {
                    convo_type !== "group" ?   null :

                    <div className={styles.dropdown_container}>
                        <GrAddCircle size={20} className={styles.add_users}/>
                        <div className={styles.dropdown_content}>
                            {
                                // Object.keys(users).filter(id => id!==current_user_id);
                                current_user.friends.filter(id =>!convo.user_ids.includes(id) ).sort().map((user_id, index)=>{
                                    const user = users[user_id];
                                    return (
                                    <div className={styles.dropdown_user_card} key={index}>
                                        <img className={styles.dropdown_user_img} src={user.img} alt=""/>
                                        <p className={styles.dropdown_user_name}>{user.user_name}</p>
                                        <HiUserAdd size={20} className={styles.add_member_btn} onClick={()=> dispatch(dataActions.addMember({user_id: user_id, convo_id: convo_id}))} />
                                    </div>)
                                })
                            }
                        </div>
                    </div>
                }
            </div>
            <div className={styles.messages_container} ref={messagesContainerRef}>
                {
                    convo.messages.map((message, index) => {
                        // console.log("mesa", message)
                        if(message.data.type === "group"){
                            return (
                                <RenderData key={index} item={message.data}/>
                            )
                        }

                        const message_user = users[message.user_id];

                        return (
                            <div className={styles.message} key={index} style={{
                                float: message.user_id === current_user_id ? "right" : "left",
                                textAlign: message.user_id === current_user_id ? "right" : "left",
                            }}>
                                {message.delete_for.includes(current_user_id) ? <p className={styles.deleted_message}>Deleted</p> : 
                                <div className={styles.data}  style={{
                                float: message.user_id === current_user_id ? "right" : "left",
                                textAlign: message.user_id === current_user_id ? "right" : "left",
                            }}>
                                <RenderData item={message.data}/>
                                </div>}
                                <div className={styles.user_details} style={{flexDirection: message.user_id === current_user_id ? "row-reverse" : "row"}}>
                                    <img className={styles.user_img} src={message_user.img} alt=""/>
                                    <div>
                                        <span className={styles.user_name}>{message_user.user_name}</span>
                                        <span className={styles.timestamp}>{formatTimestamp(message.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.chatbox_input_container}>
                {
                    convo.typing.length <=0 ? null :
                    <div className={styles.typing_indicator}>
                        {convo.typing.filter((item) => item.user_id !==current_user_id)
                        .slice(0,Math.min(2, convo.typing.length)).map((item, index) => {
                            return <div key={index} className={styles.typing_indicator_item}>
                                <p>{users[item.user_id].user_name}</p>
                                <div className={`${styles.typing_dot}`} style={ item.status ==="idle" ? {animation: "none"} : undefined}></div>
                                <div className={`${styles.typing_dot}`} style={ item.status ==="idle" ? {animation: "none"} : undefined}></div>
                                <div className={`${styles.typing_dot}`} style={ item.status ==="idle" ? {animation: "none"} : undefined}></div>
                            </div>
                        })
                        } 
                    </div>
                }
            </div>
            <div className={styles.chatbox_form}>
                <input ref={inputRef} type="text" placeholder="Enter message" className={styles.chatbox_input} onKeyDown={handleKeyDown}/> 
                <div>
                    <MdOutlineAttachFile className={styles.chatbox_attach_btn} onClick={handleAttachmentClick} size={20} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none'}}
                        onChange={handleFileChange}
                    />
                    </div>
                <FiSend className = {styles.chatbox_send_btn} onClick={handleSend}/>
            </div>
        </div>
    )
}