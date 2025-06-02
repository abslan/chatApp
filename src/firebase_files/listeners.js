import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { doc, collection, onSnapshot,query, orderBy } from "firebase/firestore";
import { db } from "./config";
import { dataActions } from "../redux/reducers/dataReducer";



export const useConvoListeners = (convoId, convoType) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!convoId || !convoType) return;
    let type = convoType
    if (convoType === "group"){
      type = "groups"
    }
    const metaRef = doc(db, `conversations_${type}`, convoId);
    const messagesRef = collection(db, `conversations_${type}`, convoId, "messages");

    const unsubMeta = onSnapshot(metaRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.last_message?.timestamp?.toMillis) {
          data.last_message.timestamp = data.last_message.timestamp.toMillis(); // serialize
        }
        dispatch(dataActions.setConvoMeta({ id: convoId,  convoType: type, data: data}));
      }
    });

    const unsubMessages = onSnapshot(query(messagesRef, orderBy("timestamp", "asc")), (snap) => {
      const messages = snap.docs.map(doc => {
        const data = doc.data();
        return {
          msg_id: doc.id,
          ...data,
          timestamp: data.timestamp?.toMillis?.() || null, // convert Firestore Timestamp
        };
      }//({ msg_id : doc.id, ...doc.data() })
    
    );
      dispatch(dataActions.setConvoMessages({ id: convoId, convoType: type, messages }));
    });

    return () => {
      unsubMeta();
      unsubMessages();
    };
  }, [convoId, convoType, dispatch]);
};