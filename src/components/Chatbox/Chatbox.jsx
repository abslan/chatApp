import { useSelector, useDispatch } from 'react-redux';
import { dataSelector, dataActions } from '../../redux/reducers/dataReducer';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import styles from './Chatbox.module.css';

export default function Chatbox() {
    const dispatch = useDispatch();
    const { conversations_duo, conversations_groups, users, session_details } = useSelector(dataSelector);
    const { current_convo_details, current_user_details, theme } = session_details;
    const { id: convoId, type: convoType } = current_convo_details;

    // Determine current conversation data
    const convoData = convoType === 'group'
    ? conversations_groups[convoId]
    : conversations_duo[convoId];
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
            convo={convoData}
            users={users}
            currentUserId={current_user_details.id}
            type={convoType}
        />
        <MessageList
            messages={messages}
        />
        {typingList.length > 0 && (
            <TypingIndicator
            typingList={typingList}
            users={users}
            currentUserId={current_user_details.id}
            />
        )}
        <ChatInput
            onSend={handleSend}
            onFileChange={handleFileChange}
            onTyping={handleTyping}
        />
        </div>
  );
}