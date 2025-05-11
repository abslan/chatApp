import { createSlice } from "@reduxjs/toolkit";

import { data } from "../../data";

// const INITIAL_STATE = data;
export const dataSlice = createSlice({
    name : "data",
    initialState: data,
    reducers: {
        openDuo: (state, action) => {
            const current_user_id = state.session_details.current_user_details.id;
            const {friend_id} = action.payload;
            const duo_id = getDuoId(current_user_id, friend_id);
            
            if(!Object.keys(state.conversations_duo).includes(duo_id)){
                state.conversations_duo[duo_id] = {
                    id: duo_id,
                    user_ids : [current_user_id, friend_id],
                    visible_for : [current_user_id, friend_id],
                    typing: [],
                    messages : [ ]
                }

                state.users[friend_id].conversations_duo.push(duo_id);
                state.users[current_user_id].conversations_duo.push(duo_id);
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
            state.users[user_id].conversations_groups.push(convo_id);


            // sample message structure
            // {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello' } ,
            //  timestamp : "00:01", user_id : "rihanna", delete_for: ["rihanna"]},
            const message = {
                data : { type: "group", value: `${state.users[user_id].user_name} is added`} ,
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

            const convo_index = state.users[user_id].conversations_groups.indexOf(convo_id);
            state.users[user_id].conversations_groups.splice(convo_index,1);

            // sample message structure
            // {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello' } ,
            //  timestamp : "00:01", user_id : "rihanna", delete_for: ["rihanna"]},
            const message = {
                data : { type: "group", value: `${state.users[user_id].user_name} is removed`} ,
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
            const convo_type = state.session_details["current_convo_details"]["type"];
            const convo_id  = state.session_details["current_convo_details"]["id"];


            if(convo_type === "group"){
                const index = state.conversations_groups[convo_id].typing.map(item => item.user_id).indexOf(user_id);
                if(index===-1){
                    state.conversations_groups[convo_id].typing.push({user_id, status})
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
                    state.conversations_duo[convo_id].typing.push({user_id, status})
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
        }
          
    },
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
export function formatTimestamp(str){
    const date = new Date(str);
    if(date.toDateString() === new Date().toDateString()){
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }else{
        return weekday[date.getDay()] + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
