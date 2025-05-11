import Chatbox from "../../components/Chatbox/Chatbox";
import Conversations from "../../components/Conversations/Conversations";
import styles from "./UserChats.module.css"

export default function UserChats(){
    return (
        
        <div className={styles.userchats}>
            <Conversations/>
            <Chatbox/>
        </div>
        
    );
}