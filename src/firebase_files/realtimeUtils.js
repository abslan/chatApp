// /status/{userId}
// {
//   isOnline: true,
//   lastSeen: timestamp
// }

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realtime_db } from "./config";


export function useUserOnlineStatus(userId) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const statusRef = ref(realtime_db, `status/${userId}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsOnline(data.isOnline);
      } else {
        setIsOnline(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return isOnline;
}

export function useGroupOnlineStatus(groupUserIds) {

  const [onlineStatuses, setOnlineStatuses] = useState({});

//   console.log("groupuserid", groupUserIds)
  useEffect(() => {
    if (!groupUserIds || groupUserIds.length === 0) return;

    const listeners = [];

    groupUserIds.forEach(userId => {
      const statusRef = ref(realtime_db, `status/${userId}`);
      const unsubscribe = onValue(statusRef, snapshot => {
        const data = snapshot.val();
        // console.log("userId", data?.isOnline)
        setOnlineStatuses(prev => {
            if (prev[userId] === data?.isOnline)  return prev;
            return {
                    ...prev,
                [userId]: data?.isOnline,
            };
            });
        });
        listeners.push(unsubscribe);
    });

    return () => {
      listeners.forEach(unsub => unsub());
    };
  }, [groupUserIds]);

  const anyOnline = Object.values(onlineStatuses).some(status => status === true);

  return { anyOnline, onlineStatuses };
}

