import styles from './Chatbox.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { makeSelectConvoPreview, sessionDetailsSelector } from '../../redux/reducers/dataReducer';
import { useMemo } from 'react';

import ChatInput from './ChatInput';

import { MessageList } from './MessageList';
import {ChatHeader} from './ChatHeader';
import { TypingIndicator } from './TypingIndicator';

import { useEffect } from 'react';
import { fetchConvoMeta, fetchPaginatedMessages } from '../../redux/reducers/dataReducer';
import { useConvoListeners } from '../../firebase_files/listeners';

import { sendMessageToFirestore, updateTypingStatusInFirestore, deleteMessageFromFirestore } from '../../redux/reducers/dataReducer';


export default function Chatbox() {
    //chatapp todo useMemo for big calculations and createSelector for caching if possible, and derive only necessary data from state
    const dispatch = useDispatch();

    const session_details  = useSelector(sessionDetailsSelector);
    const { current_convo_details, theme, messagesLoading, current_user_details } =   session_details// useSelector(sessionDetailsSelector);
    console.log("chatbox session details", session_details )
    const { id: convoId, type: convoType } = current_convo_details;
    const {id : currentUserId} = current_user_details
    
    // chatapp todo, here we need to fetch meta data, from store, but we need to dispatch thunk API first
    //and also fetch messages first, thunkAPI disptach at start  and store in redux
    // next add real time listeners to messages and convo id meta data
    const selectConvoPreview  = useMemo(() => makeSelectConvoPreview(convoId, convoType), [convoId, convoType])
    const convoData = useSelector(selectConvoPreview)
    const messages = convoData?.messages || [];
    const typingList = convoData?.typing || [];

    const lastVisible = convoData?.lastVisible;
    const fullyLoaded = convoData?.messagesFullyLoaded;

    const handleFetchMore = () => {
    if (!fullyLoaded && !messagesLoading) {
        dispatch(fetchPaginatedMessages({ convoId, convoType, lastVisible }));
    }
    };
    

    console.log("chatbox messages details", messages )

    //fetching from store initial fetch convo meta and messages  and  active listening to firestore data
    useEffect(() => {
        if (convoId && convoType) {
            dispatch(fetchConvoMeta({ convoId, convoType }));
            // dispatch(fetchConvoMessages({ convoId, convoType }));
            if(messages.length === 0 && !fullyLoaded && !messagesLoading ) dispatch(fetchPaginatedMessages({ convoId, convoType, lastVisible }));
        }
    }, [convoId, convoType, dispatch, messages.length, lastVisible, fullyLoaded, messagesLoading]);
    useConvoListeners(convoId, convoType);

  // Handlers
//     const handleSend = text => dispatch(dataActions.addMessage({ data: text, type: 'text' }));
// //   const handleTyping = (event, value) => {
// //     const status = event.key === 'Enter' ? 'finished' : 'typing';
// //     dispatch(dataActions.handleTyping({ status }));
// //   };

//     const handleTyping = status => {
//         dispatch(dataActions.handleTyping({ status }));
//     };
//     const handleFileChange = e => {
//     // chat app todo fetch from firebase
//         const file = e.target.files[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file); // creates blob URL
//             dispatch(dataActions.addMessage({ data: imageUrl, type: 'image' }))
//             e.target.value = null;
//         }
//     };

    const handleSend = (text) => {
        if (!text.trim()) return;
        const message = { type: 'text', value: text, user_id: currentUserId };
        dispatch(sendMessageToFirestore({ convoId, convoType, message }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file); // or upload to storage and get URL
        const message = { type: 'image', value: imageUrl, user_id: currentUserId };
        dispatch(sendMessageToFirestore({ convoId, convoType, message }));
        e.target.value = null;
    };

    const handleTyping = (status) => {
        dispatch(updateTypingStatusInFirestore({ convoId, convoType, status, userId: currentUserId }));
    };

    const handleDeleteMessage = (msgId) => {
        dispatch(deleteMessageFromFirestore({ convoId, convoType, msgId }));
    };


    if(!current_convo_details.id && messagesLoading){
        //chatapp todo need falback UI here 
        return null
    }

    return (
        <div className={`${styles.chatbox} ${theme === 'dark' ? styles.dark_theme : ''}`}>  
        <ChatHeader
            convo_id={current_convo_details.id}
            type={convoType}
        />
        <MessageList
            messages={messages}
            onScrollTop={handleFetchMore}
        />
        <TypingIndicator
            typingList={typingList}
        />
        <ChatInput
            onSend={handleSend}
            onFileChange={handleFileChange}
            onTyping={handleTyping}
            onDelete = {handleDeleteMessage}
        />
        </div>
  );
}