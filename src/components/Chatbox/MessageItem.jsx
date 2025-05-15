import React from 'react';
import styles from './Chatbox.module.css';
import RenderData from './RenderData';
import { formatTimestamp, selectUserById, currentUserSelector } from '../../redux/reducers/dataReducer';

import {useSelector} from 'react-redux';

export const MessageItem = React.memo(({ message }) => {

    const user = useSelector(selectUserById(message.user_id));
    const currentUserId = useSelector(currentUserSelector);

    const isOwn = message.user_id === currentUserId;


    if(message.data.type === "group"){
        return (
            <RenderData item={message.data}/>
        )
    }

    return (
    <div className={styles.message} 
        style={{ float: isOwn ? 'right' : 'left', textAlign:isOwn ? 'right' : 'left'  }}>
        {message.delete_for.includes(currentUserId) ? 
        <p className={styles.deleted_message}>Deleted</p> : 
        <div className={styles.data} >
            <RenderData item={message.data}/>
        </div>}
        <div className={styles.user_details} style={{ flexDirection: isOwn ? 'row-reverse' : 'row' }}>
        <img className={styles.user_img} src={user.img} alt="" />
        <div>
            <span className={styles.user_name}>{user.user_name}</span>
            <span className={styles.timestamp}>{formatTimestamp(message.timestamp)}</span>
        </div>
        </div>
    </div>
    );
});