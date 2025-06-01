// const url  = ""
const url = process.env.PUBLIC_URL

export const data = {
    users : {
    },
    conversations_groups : {
    },
    conversations_duo : {
   },

   session_details: {
        current_user_details : {},
        current_convo_details : { },
        theme: "dark",
        loading : true,
        conversationsMetaLoading : 0,
        messagesLoading : true,
        usersPreviewsLoading: true,
        error : null
   },


   usersPreviews :[],
}




export const data2 = {
    users : {
            "taylorswift" : {
                id : "taylorswift",
                img : url+"/images/artist1.jpeg",
                user_name : "Taylor Swift",
                is_online : false,
                conversations_duo : ["rihanna_taylorswift"],
                conversations_groups : ["convo_gid1"],
                friends : ["rihanna", "beyonce", "edsheeran", "katyperry"]
            },
            "beyonce" : {
                id : "beyonce",
                img : url+"/images/artist2.webp",
                user_name : "Beyonce",
                is_online : false,
                conversations_duo : [],
                conversations_groups : ["convo_gid1"],
                friends : ["taylorswift","rihanna", "edsheeran", "katyperry"]
            },
            "rihanna" : {
                id : "rihanna",
                img : url+"/images/artist3.jpeg",
                user_name : "Rihanna",
                is_online : false,
                conversations_duo : ["rihanna_taylorswift"],
                conversations_groups : ["convo_gid1"],
                friends : ["taylorswift", "beyonce", "edsheeran", "katyperry"]
            },
            "katyperry" : {
                id : "katyperry",
                img : url+"/images/artist4.jpeg",
                user_name : "Katy perry",
                is_online : false,
                conversations_duo : [],
                conversations_groups : ["convo_gid1"],
                friends : ["taylorswift","rihanna", "beyonce", "edsheeran"]
            },
            "edsheeran" : {
                id : "edsheeran",
                img : url+"/images/artist5.jpeg",
                user_name : "Ed Sheeran",
                is_online : false,
                conversations_duo : [],
                conversations_groups : ["convo_gid1"],
                friends : ["taylorswift","rihanna", "beyonce", "katyperry"]
            }
    },
    conversations_groups : {
         "convo_gid1" : {
            id: "convo_gid1",
            user_ids : ["rihanna", "beyonce", "edsheeran" , "taylorswift"],
            admins : ["rihanna", "beyonce", "taylorswift"],
            typing: [],
            name : "My Group",
            //{user_id: "taylorswift", status: "idle"}
            visible_for : ["rihanna", "beyonce", "edsheeran" , "taylorswift"],
            messages : [ 
                {msg_id : "convo_gid1_1", data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "rihanna", delete_for: []},
                {msg_id : "convo_gid1_2", data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "beyonce", delete_for: []},
                {msg_id : "convo_gid1_3", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "edsheeran", delete_for: []},
                {msg_id : "convo_gid1_4", data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
                {msg_id : "convo_gid1_5", data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "beyonce", delete_for: []},
                {msg_id : "convo_gid1_6", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "edsheeran", delete_for: []},
                {msg_id : "convo_gid1_7", data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "rihanna", delete_for: []},
                {msg_id : "convo_gid1_8", data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "beyonce", delete_for: []},
                {msg_id : "convo_gid1_9", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
            ],
            last_message: {msg_id : "convo_gid1_9", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
        },
    },
    conversations_duo : {
        "rihanna_taylorswift" : {
           id: "rihanna_taylorswift",
           user_ids : ["rihanna", "taylorswift"],
           visible_for : ["rihanna", "taylorswift"],
           typing: [],
           messages : [ 
               {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "rihanna", delete_for: ["rihanna"]},
               {   msg_id : "rihanna_taylorswift_2"  ,data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
               {   msg_id : "rihanna_taylorswift_3" , data : { type: 'image', value: url+"/images/cat.jpeg" }
                , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
           ], 
           last_message:  {   msg_id : "rihanna_taylorswift_3" , data : { type: 'image', value: url+"/images/cat.jpeg" }
                , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
       },
   },

   session_details: {
        current_user_details : {id: "taylorswift"},
        current_convo_details : {
            type: "group",
            id :  "convo_gid1"
        },
        // theme: "light",
        theme: "dark",
        loading : true,
        conversationsMetaLoading : 0,
        messagesLoading : true,
        usersPreviewsLoading: true,
        error : null
   },


   usersPreviews :[],
}



// { type: 'image', value: url+"/images/cat.jpeg" },
//     { type: 'link', value: 'https://www.example.com', label: 'Visit Example' },
//     { type: 'text', value: 'Hello, this is a text message.' },
//chat app todo : add function to render different data types user messages remain
