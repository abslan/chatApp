import { createSlice } from "@reduxjs/toolkit";
import { data } from "../../data";

import { createSelector } from "@reduxjs/toolkit";


import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc, getDocs ,  collection, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../firebase_files/config";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase_files/config";

import { ref, set } from 'firebase/database';
import { realtime_db } from "../../firebase_files/config";

import { v4 as uuidv4 } from 'uuid';
import { addDoc, deleteDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

import { serverTimestamp as firestoreTimestamp } from 'firebase/firestore';
import { serverTimestamp as rtdbTimestamp } from 'firebase/database';


// const INITIAL_STATE = data;
export const dataSlice = createSlice({
    name : "data",
    initialState: data,
    reducers: {
        openDuo: (state, action) => {
            const current_user_id = state.session_details.current_user_details.id;
            const {friend_id} = action.payload;
            const duo_id = getDuoId(current_user_id, friend_id);
            // console.log("open Duo action payload", action.payload, current_user_id, JSON.parse(JSON.stringify(state)), state.users)
            if(!Object.keys(state.conversations_duo).includes(duo_id)){
                state.conversations_duo[duo_id] = {
                    id: duo_id,
                    user_ids : [current_user_id, friend_id],
                    visible_for : [current_user_id, friend_id],
                    typing: [],
                    messages : [ ],
                    last_message : {},
                }

                // // Ensure both users exist
                // if (!state.users[current_user_id]) {
                //   state.users[current_user_id] = {
                //     id: current_user_id,
                //     conversations_duo: [],
                //     conversations_groups: [],
                //     friends: [],
                //     user_name: '',
                //     img: '',
                //   };
                // }

                // if (!state.users[friend_id]) {
                //   state.users[friend_id] = {
                //     id: friend_id,
                //     conversations_duo: [],
                //     conversations_groups: [],
                //     friends: [],
                //     user_name: '',
                //     img: '',
                //   };
                // }

                // // Ensure conversations_duo arrays exist
                // if (!Array.isArray(state.users[current_user_id].conversations_duo)) {
                //   state.users[current_user_id].conversations_duo = [];
                // }

                // if (!Array.isArray(state.users[friend_id].conversations_duo)) {
                //   state.users[friend_id].conversations_duo = [];
                // }

        
                if (!state.users[current_user_id].conversations_duo.includes(duo_id)) {
                  state.users[current_user_id].conversations_duo.push(duo_id);
                }

                 //  if (!state.users[friend_id].conversations_duo.includes(duo_id)) {
              //     state.users[friend_id].conversations_duo.push(duo_id);
              //   }

                // state.users[current_user_id].conversations_duo.push(duo_id);

                // state.users[friend_id].conversations_duo.push(duo_id);
            }

            if(state.conversations_duo[duo_id].visible_for.indexOf(current_user_id)===-1){
                state.conversations_duo[duo_id].visible_for.push(current_user_id)
            }

            state.session_details.current_convo_details = {
                ...state.session_details.current_convo_details,
                type: "duo",
                id : duo_id
            }
            

        },
        hideCard : (state, action) => {
            const {type , id} = action.payload
            const current_user_id = state.session_details.current_user_details.id;

            if(type==="group"){
                const index = state.conversations_groups[id].visible_for.indexOf(current_user_id);
                if(index!==-1){
                    state.conversations_groups[id].visible_for.splice(index,1)
                }
            }else if(type==="duo"){
                const index = state.conversations_duo[id].visible_for.indexOf(current_user_id);
                if(index!==-1){
                    state.conversations_duo[id].visible_for.splice(index,1)
                }
            }

            //chat app todo decide 
            // if(state.session_details.current_convo_details.id === id && state.session_details.current_convo_details.type === type){
            //     state.session_details.current_convo_details = {
            //         ...state.session_details.current_convo_details,
            //         type: null,
            //         id : null
            //     }
            // }

        }, 

        createGroup: (state, action) => {

        },
        deleteDuo: (state, action) => {

        },
        deleteGroup: (state, action) => {

        },
        addMember: (state, action) => {
            const {convo_id, user_id} = action.payload;
            // console.log("addMember",convo_id, user_id);
            //chat app todo admin functionality
            // const current_user_id = state.session_details.current_user_details.id;
            // if(state.conversations_groups[convo_id].admins)

            state.conversations_groups[convo_id].user_ids.push(user_id);
            // state.users[user_id].conversations_groups.push(convo_id);

            //chatApp todo integrate with firestore
            // sample message structure
            // {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello' } ,
            //  timestamp : "00:01", user_id : "rihanna", delete_for: ["rihanna"]},
            const message = {
                data : { type: "group", value: `${state.usersPreviews[user_id].user_name} is added`} ,
                timestamp : new Date().toString(), 
                user_id : null, 
                delete_for: []
            }
            state.conversations_groups[convo_id].messages.push( {
                ...message,
                msg_id : convo_id + (state.conversations_groups[convo_id].messages.length+1)
            } )
            
        },
        removeMember: (state, action) => {
            const {convo_id, user_id} = action.payload;
            // console.log("removeMember",convo_id, user_id);
            if(state.conversations_groups[convo_id].user_ids.length<=2){
                console.log("minimum 2 users required per group")
                //chat app todo alert box
                return
            }
            const user_index = state.conversations_groups[convo_id].user_ids.indexOf(user_id);
            state.conversations_groups[convo_id].user_ids.splice(user_index,1);

            //chatApp todo need to add functionality to remove user properly in firestore
            // const convo_index = state.users[user_id].conversations_groups.indexOf(convo_id);
            // state.users[user_id].conversations_groups.splice(convo_index,1);

            // sample message structure
            // {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello' } ,
            //  timestamp : "00:01", user_id : "rihanna", delete_for: ["rihanna"]},
            const message = {
                data : { type: "group", value: `${state.usersPreviews[user_id].user_name} is removed`} ,
                timestamp : new Date().toString(), 
                user_id : null, 
                delete_for: []
            }
            state.conversations_groups[convo_id].messages.push( {
                ...message,
                msg_id : convo_id + (state.conversations_groups[convo_id].messages.length+1)
            } )

        },
        addMessage: (state, action) => {
            // sample message structure
            // {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello' } ,
            //  timestamp : "00:01", user_id : "rihanna", delete_for: ["rihanna"]},
            const {type, data} = action.payload;
            // console.log(data, type)

            const user_id = state.session_details.current_user_details.id;
            const convo_type = state.session_details["current_convo_details"]["type"];
            const convo_id  = state.session_details["current_convo_details"]["id"];

            // return 
            const message = {
                data : { type: type, value: data} ,
                timestamp : new Date().toString(), 
                user_id : user_id, 
                delete_for: []
            }

            if(convo_type==="group"){
                state.conversations_groups[convo_id].messages.push( {
                    ...message,
                    msg_id : convo_id + (state.conversations_groups[convo_id].messages.length+1)
                } )
            }else{
                state.conversations_duo[convo_id].messages.push( {
                    ...message,
                    msg_id : convo_id + (state.conversations_duo[convo_id].messages.length+1)
                } )

            }
            

        },

        removeMessage: (state, action) => {

        },

        userLogout: (state, action) => {
            // state.session_details.current_user_details = {}
            // state.session_details.current_convo_details = {}
            // state.session_details.loading = true
            // state.session_details.conversationsMetaLoading = true
            return { ...data };
        },
        userLogin: (state, action) => {

        },


        addFriend: (state, action) => {

        },
        removeFriend: (state, action) => {

        },
        addUser: (state, action) => {

        },
        removeUser: (state, action) => {

        },


        toggleTheme: (state, action) => {
            state.session_details.theme = state.session_details.theme === "light" ? "dark" : "light";
            document.getElementById("App").classList.toggle("dark_theme")

        },

        handleTyping: (state, action) => {
            // console.log("typing", action.payload )
            // state.conversations_groups
            const { status} = action.payload;
            const user_id = state.session_details.current_user_details.id;
            const user_name = state.users[user_id].user_name;
            const convo_type = state.session_details["current_convo_details"]["type"];
            const convo_id  = state.session_details["current_convo_details"]["id"];
            


            if(convo_type === "group"){
                const index = state.conversations_groups[convo_id].typing.map(item => item.user_id).indexOf(user_id);
                if(index===-1){
                    state.conversations_groups[convo_id].typing.push({user_id, user_name, status})
                    return
                }
                if(status==="finished"){
                    state.conversations_groups[convo_id].typing.splice(index,1);
                }else{
                    state.conversations_groups[convo_id].typing[index].status = status;
                }
                // console.log("typing group",state.conversations_groups[convo_id].typing )
            }else{
                const index = state.conversations_duo[convo_id].typing.map(item => item.user_id).indexOf(user_id)
                if(index===-1){
                    state.conversations_duo[convo_id].typing.push({user_id, user_name, status})
                    return
                }
                if(status==="finished"){
                    state.conversations_duo[convo_id].typing.splice(index,1);
                }else{
                    state.conversations_duo[convo_id].typing[index].status = status;
                }
                // console.log("typing duo",state.conversations_duo[convo_id].typing )
            }

        },

        handleCardClick : (state, action) => {
            const {id, type} = action.payload;
            // console.log(id,  type)

            state.session_details.current_convo_details = {
                ...state.session_details.current_convo_details,
                type: type,
                id : id
            }
        },
        
        setConvoMeta: (state, action) => {
            const { id, convoType, data } = action.payload;
            if (!state[`conversations_${convoType}`]) state[`conversations_${convoType}`] = {};
            state[`conversations_${convoType}`][id] = {
                ...(state[`conversations_${convoType}`][id] || {}),
                ...data,
        };
        },
        setConvoMessages: (state, action) => {
            const { id, convoType, messages } = action.payload;
            if (!state[`conversations_${convoType}`]) state[`conversations_${convoType}`] = {};
            if (!state[`conversations_${convoType}`][id]) {
                state[`conversations_${convoType}`][id] = {};
            }
            state[`conversations_${convoType}`][id].messages = messages;
        },

    },

    extraReducers: (builder) => {
    builder
        //fetchUserData handlers
        .addCase(fetchUserData.pending, (state) => {
            state.session_details.loading = true;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {

            //setting data here itself
            state.session_details.current_user_details = action.payload;
            state.users[action.payload.id] = action.payload;
            state.session_details.loading = false;
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            state.session_details.loading = false;
            state.session_details.error = action.payload;
        })

        // fetchConversationsMetaByType handlers
        .addCase(fetchConversationsMetaByType.pending, (state) => {
            state.session_details.conversationsMetaLoading = true;
        })
        .addCase(fetchConversationsMetaByType.fulfilled, (state, action) => {
            state.session_details.conversationsMetaLoading = false;
        // Merge the fetched metadata into store
        // Object.entries(action.payload).forEach(([id, convoData]) => {
        //     state.conversations[id] = convoData;
        // });
            const {results, type} = action.payload;
            if (type === "group"){
                state.conversations_groups = results
            }else if (type === "duo"){
                state.conversations_duo = results
            }

        })
        .addCase(fetchConversationsMetaByType.rejected, (state, action) => {
            state.conversationsMetaLoading = false;
            state.conversationsMetaError = action.payload;
        })
         

                //fetch user Previews by ids

        .addCase(fetchUserPreviewsThunk.pending, (state) => {
            state.session_details.usersPreviewsLoading = true;
            state.session_details.error = null;
        })
        .addCase(fetchUserPreviewsThunk.fulfilled, (state, action) => {
            // action.payload.forEach((preview) => {
            // state.usersPreviews[preview.user_id] = preview;
            // });
            // state.usersPreviews.push(...action.payload.fetched_result)
            state.usersPreviews = {
                ...state.usersPreviews,
                ...action.payload
            };
            state.session_details.usersPreviewsLoading = false;
        })
        .addCase(fetchUserPreviewsThunk.rejected, (state, action) => {
            state.session_details.usersPreviewsLoading = false;
            state.session_details.error =  action.payload || "Failed to load user previews";
        })


        .addCase(fetchConvoMeta.pending, (state) => {
            state.session_details.conversationsMetaLoading = true;
        })
        .addCase(fetchConvoMeta.fulfilled, (state, action) => {
            const { id, data, convoType } = action.payload;
            const key = `conversations_${convoType}`;
            if (!state[key]) state[key] = {};
            state[key][id] = {
            ...(state[key][id] || {}),
            ...data,
            };
            state.session_details.conversationsMetaLoading = false;
        })
        .addCase(fetchConvoMeta.rejected, (state) => {
            state.session_details.conversationsMetaLoading = false;
        })

        .addCase(fetchMultipleConvoMeta.pending, (state) => {
          state.session_details.conversationsMetaLoading = 
            (state.session_details.conversationsMetaLoading || 0) + 1;
        })
        .addCase(fetchMultipleConvoMeta.fulfilled, (state, action) => {
          const { type, results } = action.payload;
          results.forEach(meta => {
            state[`conversations_${type}`][meta.id] = { 
              ...meta.data,
              messages: [],
              lastVisible: null, 
              messagesFullyLoaded: false,
            
            };
          });
          state.session_details.conversationsMetaLoading = 
            Math.max((state.session_details.conversationsMetaLoading || 1) - 1, 0);
        })
        .addCase(fetchMultipleConvoMeta.rejected, (state, action) => {
          state.session_details.conversationsMetaLoading = 
            Math.max((state.session_details.conversationsMetaLoading || 1) - 1, 0);
          state.session_details.error = action.payload || action.error?.message || "Unknown error";
        })

        .addCase(fetchConvoMessages.pending, (state) => {
            state.session_details.messagesLoading = true;
        })
        .addCase(fetchConvoMessages.fulfilled, (state, action) => {
               // console.log("fetchConvoMessages.fulfilled", action.payload, current_user_id, JSON.parse(JSON.stringify(state)), state.users)
            const { id, messages, convoType } = action.payload;
            const key = `conversations_${convoType}`;
            if (!state[key]) state[key] = {};
            if (!state[key][id]) state[key][id] = {};
            state[key][id].messages = messages;
        })
        .addCase(fetchConvoMessages.rejected, (state) => {
            state.session_details.messagesLoading = false;
        })



        .addCase(fetchPaginatedMessages.pending, (state) => {
          state.session_details.messagesLoading = true;
        })
        .addCase(fetchPaginatedMessages.fulfilled, (state, action) => {
          const { convoId, convoType, messages, lastVisible, fullyLoaded } = action.payload;
          const key = `conversations_${convoType}`;
          const convo = state[key][convoId];

          if (!convo.messages) convo.messages = [];

          convo.messages = [ ...convo.messages, ...messages]; // already reversed in thunk
          convo.lastVisible = lastVisible;
          convo.messagesFullyLoaded = fullyLoaded;

          state.session_details.messagesLoading = false;
        })
        .addCase(fetchPaginatedMessages.rejected, (state, action) => {
          state.session_details.messagesLoading = false;
          state.session_details.error = action.payload || action.error.message;
        });

        }       
})


export function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

function getDuoId(str1, str2){
    const comparisonResult = str1.localeCompare(str2);

    if (comparisonResult <= 0) {
        return str1 + "_" + str2;
    } else {
        return str2 + "_" +  str1;
    }



}

const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
export function formatTimestamp(ts) {
  let date;

  if (ts instanceof Date) {
    date = ts;
  } else if (ts?.toDate) {
    date = ts.toDate(); // Firestore Timestamp object
  } else if (typeof ts === 'string' || typeof ts === 'number') {
    date = new Date(ts);
  } else {
    return ''; // invalid timestamp
  }

  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return weekday[date.getDay()] + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

export const dataReducer = dataSlice.reducer;
export const dataActions = dataSlice.actions;

// create and export data selector function here
export const dataSelector = (state) => state.dataReducer;
export const usersSelector = (state) => state.dataReducer.users;
export const convoGroupSelector = (state) => state.dataReducer.conversations_groups;
export const convoDuoSelector = (state) => state.dataReducer.conversations_duo;
export const sessionDetailsSelector = (state) => state.dataReducer.session_details;

export const selectUserById = (userId) => (state) => state.dataReducer.users[userId];
export const selectUsersByIds = (userIds) => (state) => userIds.map(id => state.dataReducer.users[id]);
export const selectUserFriends = (userId) => (state) => state.dataReducer.users[userId].friends;

// export const selectUsersPreviewByIds = (userIds) => (state) =>
//   userIds.map(id => {
//     const user = state.dataReducer.users[id];
//     return user ? { user_id: id, img: user.img, user_name: user.user_name } : null;
//   });

export const selectUserPreviewsByIds = (state, userIds) => {
  const all = state.dataReducer.usersPreviews;
  return userIds.map(id => all.find(u => u.user_id === id)).filter(Boolean);
};


//reselect selectors for caching
export const makeSelectUsersPreviewByIds = () => createSelector(
  [
    usersSelector,
    (state, userIds) => userIds,
  ],
  (users, userIds) => {
    // map userIds to user preview objects
    return userIds.map(id => {
      const user = users[id];
      if (!user) return null;
      return {
        user_id: id,
        img: user.img,
        user_name: user.user_name,
      };
    });
  }
);

export const makeSelectUsersByIds = (userIds) =>
  createSelector(
    (state) => state.dataReducer.users,
    (users) => userIds.map(id => users[id])
  );

export const makeSelectUserById = (userId) =>
  createSelector(
    (state) => state.dataReducer.users[userId],
    (user) => user
  );

//convo 

export const selectSessionUserId = (state) => state.dataReducer.session_details.current_user_details.id;

export const selectSessionLoadingState = (state) => state.dataReducer.session_details.loading

export const selectConvoUserIds = (convo_id, type) => (state) => {
    if (type==="group"){
        return state.dataReducer.conversations_groups[convo_id]?.user_ids;
    }else if(type === "duo"){
        return state.dataReducer.conversations_duo[convo_id]?.user_ids;
    }  
}
export const selectConvoName = (convo_id) => (state) => state.dataReducer.conversations_groups[convo_id]?.name;

export const selectConvoMessages =  (convo_id, type) => (state) => {
    if (type==="group"){
        return state.dataReducer.conversations_groups[convo_id]?.messages;
    }else if(type === "duo"){
        return state.dataReducer.conversations_duo[convo_id]?.messages;
    }  
}

export const selectConvoTypingList =  (convo_id, type) => (state) => {
    if (type==="group"){
        return state.dataReducer.conversations_groups[convo_id]?.typing;
    }else if(type === "duo"){
        return state.dataReducer.conversations_duo[convo_id]?.typing;
    }  
}

export const makeSelectConvosMetaDataPreview = (convo_ids, type) => {
  return createSelector(
    (state) => {
      const source = type === "group" ? state.dataReducer.conversations_groups : state.dataReducer.conversations_duo;
    //   console.log("makeselectconvosmetadatapreview", type, source)
      return convo_ids.map((convo_id) => {
        const convo = source[convo_id];
        if (!convo) return null;

        const { id, user_ids, admins, name, visible_for, last_message } = convo;

        return type === "group"
          ? { id, user_ids, admins, name, visible_for, last_message }
          : { id, user_ids, visible_for, last_message };
      }).filter(Boolean); // remove nulls if any convo_id is invalid
    },
    (convosMeta) => convosMeta
  );
};



export const makeSelectConvoPreview = (convo_id, type) =>  createSelector(
    [
        selectConvoMessages(convo_id, type),
        selectConvoTypingList(convo_id, type), 
    ],
    (messages, typing) => {
        return {messages: messages, typing: typing}
    }
) 






// SETTERS 


//utils
export const formatEmailToId = (email) => {
    return email.replace('@gmail.com', '');
};


export const formatImageSource = (src) => {
    const isBase64 = src.startsWith("data:image/") || /^[A-Za-z0-9+/=]+$/.test(src);
    const imageSrc = isBase64
    ? src.startsWith("data:image/") 
        ? src 
        : `data:image/jpeg;base64,${src}`
    : src;
    return imageSrc;
}

//thunks

export const fetchUserData = createAsyncThunk(
    "data/fetchUserData",
    async (uid, thunkAPI) => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        console.log("fetchuserdata", "fetching user")
        if (userDoc.exists()) return userDoc.data();
        console.log("fetchuserdata", "user not found")
        return thunkAPI.rejectWithValue("User not found");
    } catch (err) {
        console.log("fetchuserdata error", err)
        return thunkAPI.rejectWithValue(err.message);
    }
    }
);


export const handleLogout = createAsyncThunk(
  'data/handleLogout',
  async (_, thunkAPI) => {
    try {
        //real time updates of online status
        const user = auth.currentUser;
        if (user) {
          const id = formatEmailToId(user.email)
          const userStatusRef = ref(realtime_db, `/status/${id}`);

          await set(userStatusRef, {
              isOnline: false,
              lastSeen: rtdbTimestamp(),
          });
        }

        await signOut(auth);

        localStorage.removeItem('dataState');

        thunkAPI.dispatch(dataActions.userLogout()); 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
  }
);


//Fetch user previews (id, img, name) 

// export async function fetchUserPreviewsByIds(userIds) {
//   const previews = [];

//   for (const id of userIds) {
//     try {
//       const docSnap = await getDoc(doc(db, "users", id));
//       if (docSnap.exists()) {
//         const user = docSnap.data();
//         previews.push({
//           user_id: id,
//           img: user.img || null,
//           user_name: user.user_name || "",
//         });
//       }
//     } catch (error) {
//       console.error(`Error fetching user ${id}:`, error);
//     }
//   }

//   return previews;
// }

// export const fetchUserPreviewsThunk = createAsyncThunk(
//   "users/fetchPreviews",
//   async (userIds, thunkAPI) => {
//     try {
//       const previews = [];
//       const chunks = [];

//       for (let i = 0; i < userIds.length; i += 10) {
//         chunks.push(userIds.slice(i, i + 10));
//       }

//       for (const chunk of chunks) {
//         const q = query(collection(db, "users"), where("__name__", "in", chunk));
//         const snapshot = await getDocs(q);

//         snapshot.forEach((doc) => {
//           const user = doc.data();
//           previews.push({
//             user_id: doc.id,
//             img: user.img || null,
//             user_name: user.user_name || "",
//           });
//         });
//       }

//       return previews;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

//cached comparision and fetch
export const fetchUserPreviewsThunk = createAsyncThunk(
  "users/fetchUserPreviewsByIds",
  async (userIds, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const alreadyInStore = state.dataReducer.usersPreviews;
      const idsToFetch = userIds.filter(id => !alreadyInStore[id]);

      const result = {};

      // Add already cached users
      userIds.forEach(id => {
        if (alreadyInStore[id]) {
          result[id] = {
            user_id: id,
            img: alreadyInStore[id].img || null,
            user_name: alreadyInStore[id].user_name || "",
          };
        }
      });

      // Firestore chunked fetch
      for (let i = 0; i < idsToFetch.length; i += 10) {
        const chunk = idsToFetch.slice(i, i + 10);
        const q = query(collection(db, "users"), where("__name__", "in", chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const user = doc.data();
          result[doc.id] = {
            user_id: doc.id,
            img: user.img || null,
            user_name: user.user_name || "",
          };
        });
      }

      return result; // final object keyed by user_id
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




//convos meta data, list of convo_ids  => (all prop except messages)
export const fetchConversationsMetaByType = createAsyncThunk(
  "data/fetchMetaByType",
  async ({ ids, type }, thunkAPI) => {
    try {
      const results = {};

      const collectionName =
        type === "group" ? "conversations_groups" : "conversations_duo";

      await Promise.all(
        ids.map(async (id) => {
          const docRef = doc(db, collectionName, id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            results[id] = snap.data() //{ ...snap.data(), id, type };
          }
        })
      );

      return {results, type};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch metadata");
    }
  }
);


// Fetch messages once if not in cache
export const fetchConvoMessages = createAsyncThunk(
  "data/fetchConvoMessages",
  async ({ convoId, convoType }, { rejectWithValue }) => {
    try {
      let type = convoType === "group" ? "groups" : convoType;
      const msgRef = collection(db, `conversations_${type}`, convoId, "messages");
      const q = query(msgRef, orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          msg_id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate()?.toISOString() || null, // Convert Firestore Timestamp to string
        }
    }
        // ({ msg_id: doc.id, ...doc.data() })
      );
      const result = { id: convoId, convoType: type, messages };
      console.log("fetch Convo messages" , result)
      return result;

    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ convoId, convoType }, { getState }) => {
      const state = getState();
      const key = `conversations_${convoType === "group" ? "groups" : convoType}`;
      console.log("fetching convo messages: ", !state.dataReducer[key][convoId].messages)
      return !state.dataReducer[key][convoId].messages;
    }
  }
);

// Fetch metadata once if not in cache
export const fetchConvoMeta = createAsyncThunk(
  "data/fetchConvoMeta",
  async ({ convoId, convoType }, { rejectWithValue }) => {
    try {
      let type = convoType === "group" ? "groups" : convoType;
      const docRef = doc(db, `conversations_${type}`, convoId);
      console.log("fetching Convo meta result" , convoId, convoType)
      const snap = await getDoc(docRef);
      if (!snap.exists()) throw new Error("Meta not found");
      const result = { id: convoId, convoType: type, data: snap.data() }
      console.log("fetched Convo meta result" , result)
      return result;
    } catch (e) {
      console.log("fetch Convo meta error " , e)
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ convoId, convoType }, { getState }) => {
      const state = getState();
      const key = `conversations_${convoType === "group" ? "groups" : convoType}`;
      console.log("fetching convo meta condition: ", !state.dataReducer[key][convoId])
      return !state.dataReducer[key][convoId];
    }
  }
);



export const fetchMultipleConvoMeta = createAsyncThunk(
  "data/fetchMultipleConvoMeta",
  async ({ convoIds, convoType }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const type = convoType === "group" ? "groups" : convoType;
      const missingIds = convoIds.filter(id => {
        const data = state.dataReducer[`conversations_${type}`][id];
        return !data || !data.id;
      });

      const fetchPromises = missingIds.map(async convoId => {
        const docRef = doc(db, `conversations_${type}`, convoId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) throw new Error(`Meta not found for ${convoId}`);
        return { id: convoId, convoType: type, data: snap.data() };
      });

      console.log("fetching  Convo multiple meta " , convoIds)
      const results = await Promise.all(fetchPromises);
       console.log("fetched Convo multiple meta results  " , results)
      return { type, results }; // send both type and all fetched metadata
    } catch (e) {
      console.log("fetched Convo multiple meta error  " , e)
      return rejectWithValue(e.message);
    }
  }
);




export const fetchPaginatedMessages = createAsyncThunk(
  "data/fetchPaginatedMessages",
  async ({ convoId, convoType, lastVisible }, { rejectWithValue }) => {
    try {
      const type = convoType === "group" ? "groups" : convoType;
      const msgRef = collection(db, `conversations_${type}`, convoId, "messages");
      // const q = lastVisible
      //   ? query(msgRef, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(20))
      //   : query(msgRef, orderBy("timestamp", "desc"), limit(20));

      let q = query(msgRef, orderBy("timestamp", "desc"), limit(20));

      if (lastVisible?.id) {
        const lastDocSnap = await getDoc(doc(msgRef, lastVisible.id));
        if (lastDocSnap.exists()) {
          q = query(msgRef, orderBy("timestamp", "desc"), startAfter(lastDocSnap), limit(20));
        }
      }

      console.log("fetching paginated messages", convoId, convoType, lastVisible  )
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map(doc => {
        // msg_id: doc.id,
        // ...doc.data(),
        // timestamp: doc.data().timestamp.toMillis()// This ensures  messages' timestamps are also serializable for Redux
        const data = doc.data()
        return {
          msg_id: doc.id,
          ...data,
          timestamp: data.timestamp?.toMillis ? data.timestamp.toMillis() : data.timestamp
        }
      });
      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
      const result = {
        convoId,
        convoType: type,
        messages: messages.reverse(), // earliest first
        // lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,// This is non-serializable Firestore object, cant store in redux
        lastVisible: lastVisibleDoc ? {
          id: lastVisibleDoc.id,
          // timestamp: lastVisibleDoc.data().timestamp.toMillis()  // convert Firestore Timestamp to number
          timestamp: lastVisibleDoc.data().timestamp?.toMillis
          ? lastVisibleDoc.data().timestamp.toMillis()
          : lastVisibleDoc.data().timestamp
        } : null,
        fullyLoaded: snapshot.size < 20
      }
      console.log("fetched paginated messages", result )
      return result;
    } catch (e) {
      console.log("fetch paginated messages error", e )
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ convoId, convoType }, { getState }) => {
      const state = getState();
      const type = convoType === "group" ? "groups" : convoType;
      const convo = state.dataReducer[`conversations_${type}`]?.[convoId];
      return !(convo?.messagesFullyLoaded); // skip if already fully loaded
    }
  }
);



export const sendMessageToFirestore = createAsyncThunk(
  'data/sendMessageToFirestore',
  async ({ convoId, convoType, message }, thunkAPI) => {
    const type = convoType === 'group' ? 'groups' : 'duo';
    const messagesRef = collection(db, `conversations_${type}`, convoId, 'messages');
    const convoRef = doc(db, `conversations_${type}`, convoId);

    const msgDoc = {
      msg_id: uuidv4(),
      data: { type: message.type, value: message.value },
      timestamp: firestoreTimestamp(),
      user_id: message.user_id,
      delete_for: []
    };
    await addDoc(messagesRef, msgDoc);
    // No need to dispatch manually here; listener updates Redux
    await updateDoc(convoRef, {
      last_message: {
        ...msgDoc,
        timestamp: firestoreTimestamp() // use again for consistency
      }
    });

    return msgDoc;
  }
);

export const deleteMessageFromFirestore = createAsyncThunk(
  //chatApp todo delete message funcitonality not included in app
  'data/deleteMessageFromFirestore',
  async ({ convoId, convoType, msgId }, thunkAPI) => {
    const type = convoType === 'group' ? 'groups' : 'duo';
    const msgDocRef = doc(db, `conversations_${type}`, convoId, 'messages', msgId);
    await deleteDoc(msgDocRef);
    // Listener will sync state after deletion
    return msgId;
  }
);

export const updateTypingStatusInFirestore = createAsyncThunk(
  'data/updateTypingStatusInFirestore',
  async ({ convoId, convoType, status, userId }, thunkAPI) => {
    const type = convoType === 'group' ? 'groups' : 'duo';
    const convoDocRef = doc(db, `conversations_${type}`, convoId);

    console.log("updateTypingStatusInFirestore", convoId, convoType, status, userId )
    if (status === 'typing') {
      await updateDoc(convoDocRef, { typing: arrayUnion(userId) });
    } 
    else if (status === 'finished') {
      await updateDoc(convoDocRef, { typing: arrayRemove(userId) });
    }
    console.log("updated StatusInFirestore", convoId, convoType, status, userId )

    return { status, userId };
  }
);

