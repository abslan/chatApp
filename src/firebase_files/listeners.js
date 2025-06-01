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
        dispatch(dataActions.setConvoMeta({ id: convoId,  convoType: type, data: docSnap.data() }));
      }
    });

    const unsubMessages = onSnapshot(query(messagesRef, orderBy("timestamp", "asc")), (snap) => {
      const messages = snap.docs.map(doc => ({ msg_id : doc.id, ...doc.data() }));
      dispatch(dataActions.setConvoMessages({ id: convoId, convoType: type, messages }));
    });

    return () => {
      unsubMeta();
      unsubMessages();
    };
  }, [convoId, convoType, dispatch]);
};