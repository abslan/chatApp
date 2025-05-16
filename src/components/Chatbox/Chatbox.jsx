import styles from './Chatbox.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { dataActions, makeSelectConvoPreview, sessionDetailsSelector } from '../../redux/reducers/dataReducer';
import { useMemo } from 'react';

import ChatInput from './ChatInput';

import { MessageList } from './MessageList';
import {ChatHeader} from './ChatHeader';
import { TypingIndicator } from './TypingIndicator';


export default function Chatbox() {
    //chatapp todo useMemo for big calculations and createSelector for caching if possible, and derive only necessary data from state
    const dispatch = useDispatch();

    const { current_convo_details, theme } = useSelector(sessionDetailsSelector);
    const { id: convoId, type: convoType } = current_convo_details;
    
    const selectConvoPreview  = useMemo(() => makeSelectConvoPreview(convoId, convoType), [convoId, convoType])
    const convoData = useSelector(selectConvoPreview)
    const messages = convoData?.messages || [];
    const typingList = convoData?.typing || [];

  // Handlers
    const handleSend = text => dispatch(dataActions.addMessage({ data: text, type: 'text' }));
//   const handleTyping = (event, value) => {
//     const status = event.key === 'Enter' ? 'finished' : 'typing';
//     dispatch(dataActions.handleTyping({ status }));
//   };

    const handleTyping = status => {
        dispatch(dataActions.handleTyping({ status }));
    };
    const handleFileChange = e => {
    // Implement file upload logic
    };

    return (
        <div className={`${styles.chatbox} ${theme === 'dark' ? styles.dark_theme : ''}`}>  
        <ChatHeader
            convo_id={current_convo_details.id}
            type={convoType}
        />
        <MessageList
            messages={messages}
        />
        <TypingIndicator
            typingList={typingList}
        />
        <ChatInput
            onSend={handleSend}
            onFileChange={handleFileChange}
            onTyping={handleTyping}
        />
        </div>
  );
}