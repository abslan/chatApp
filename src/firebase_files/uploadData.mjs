// uploadUsers.js

// const { initializeApp } = require("firebase/app");
// const { getFirestore, doc, setDoc } = require("firebase/firestore");

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB_8B_rgQsc_dfCIZDySKNPqyhArVlU_Zg",
  authDomain: "chatapp-768e2.firebaseapp.com",
  projectId: "chatapp-768e2",
  storageBucket: "chatapp-768e2.firebasestorage.app",
  messagingSenderId: "360160617334",
  appId: "1:360160617334:web:50b896b8e5f55a2f0f5057",
  measurementId: "G-X7GSMGW5WT"
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample users data (replace with your own data)
// const url = process.env.PUBLIC_URL

import path from 'path';
import { fileURLToPath } from 'url';
// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, '../../', 'public');
const url = imagePath
const users = {
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
};

const data ={
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
            messages : {
                "convo_gid1_1" : {msg_id : "convo_gid1_1", data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "rihanna", delete_for: []},
                "convo_gid1_2": {msg_id : "convo_gid1_2", data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "beyonce", delete_for: []},
                "convo_gid1_3": {msg_id : "convo_gid1_3", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "edsheeran", delete_for: []},
                "convo_gid1_4": {msg_id : "convo_gid1_4", data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
                "convo_gid1_5": {msg_id : "convo_gid1_5", data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "beyonce", delete_for: []},
                "convo_gid1_6":  {msg_id : "convo_gid1_6", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "edsheeran", delete_for: []},
                "convo_gid1_7": {msg_id : "convo_gid1_7", data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "rihanna", delete_for: []},
                "convo_gid1_8": {msg_id : "convo_gid1_8", data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "beyonce", delete_for: []},
                "convo_gid1_9": {msg_id : "convo_gid1_9", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
            },
            last_message: {msg_id : "convo_gid1_9", data : { type: 'image', value: url+"/images/cat.jpeg" } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
        },
    },
    conversations_duo : {
        "rihanna_taylorswift" : {
           id: "rihanna_taylorswift",
           user_ids : ["rihanna", "taylorswift"],
           visible_for : ["rihanna", "taylorswift"],
           typing: [],
           messages : {
              "rihanna_taylorswift_1": {   msg_id : "rihanna_taylorswift_1" ,data : { type: 'text', value: 'Hello, this is a text message.' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "rihanna", delete_for: ["rihanna"]},
              "rihanna_taylorswift_2": {   msg_id : "rihanna_taylorswift_2"  ,data : { type: 'link', value: 'https://www.example.com', label: 'Visit Example' } , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
              "rihanna_taylorswift_3": {   msg_id : "rihanna_taylorswift_3" , data : { type: 'image', value: url+"/images/cat.jpeg" }
                , timestamp : "Mon Aug 12 2023 07:32:16 GMT+0530 (India Standard Time)", user_id : "taylorswift", delete_for: []},
           }, 
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
   }
}




import fs from 'fs';

async function uploadUsers(rawUsers) {
  for (const [key, user] of Object.entries(rawUsers)) {
    const imagePath = path.resolve(user.img); // Adjust path if needed
    if (fs.existsSync(imagePath)) {
      const imageData = fs.readFileSync(imagePath);
      const base64Image = imageData.toString("base64");

      const userWithBase64 = {
        ...user,
        img: base64Image,
      };

      try {
        const docRef = doc(db, "users", key);
        await setDoc(docRef, userWithBase64);
        console.log(`Uploaded user ${key}`);
      } catch (error) {
        console.error(`Error uploading user ${key}:`, error);
      }
    } else {
      console.error("Image does not exist at", imagePath);
    }
  }
  console.log("All users processed");
}

/** Helper to convert image path to base64 */
function getBase64IfImage(message) {
  if (message.data.type === "image") {
    const imageUrl = message.data.value;
    // const imagePath = imageUrl.replace(/^.*\/images\//, ""); // extract filename
    const resolvedPath = path.resolve(imageUrl);

    if (fs.existsSync(resolvedPath)) {
      const imageBuffer = fs.readFileSync(resolvedPath);
      message.data.value = imageBuffer.toString("base64");
    } else {
      console.warn("Image not found:", resolvedPath);
    }
  }
  return message;
}

// async function uploadGroupConversations(conversationsGroups) {
//   for (const [id, group] of Object.entries(conversationsGroups)) {
//     const updatedMessages = group.messages.map(getBase64IfImage);
//     const updatedLastMessage = getBase64IfImage(group.last_message);
//     const groupWithImages = { ...group,last_message: updatedLastMessage,
//        messages: updatedMessages 
//       };


//     try {
//       const docRef = doc(db, "conversations_groups", id);
//       await setDoc(docRef, groupWithImages);
//       console.log(`Uploaded group conversation ${id}`);
//     } catch (error) {
//       console.error(`Error uploading group ${id}:`, error);
//     }
//   }
// }

async function uploadGroupConversations(conversationsGroups) {
  for (const [id, group] of Object.entries(conversationsGroups)) {
    // Destructure messages and remove from group object
    const { messages, ...groupMeta } = group;

    // Convert last_message image to base64 if needed
    const updatedLastMessage = getBase64IfImage(group.last_message);
    const groupDoc = {
      ...groupMeta,
      last_message: updatedLastMessage
    };

    try {
      const groupDocRef = doc(db, "conversations_groups", id);

      // Upload group metadata (without messages)
      await setDoc(groupDocRef, groupDoc);

      // Upload each message as a document in the subcollection
      const messagesColRef = collection(groupDocRef, "messages");

      for (const [msgId, msgObj] of Object.entries(messages)) {
        const updatedMsg = getBase64IfImage(msgObj);
        const msgDocRef = doc(messagesColRef, msgId);
        await setDoc(msgDocRef, updatedMsg);
      }

      console.log(`Uploaded group conversation ${id}`);
    } catch (error) {
      console.error(`Error uploading group ${id}:`, error);
    }
  }
}

// async function uploadDuoConversations(conversationsDuo) {
//   for (const [id, convo] of Object.entries(conversationsDuo)) {
//     const updatedMessages = convo.messages.map(getBase64IfImage);
//     const updatedLastMessage = getBase64IfImage(convo.last_message);
//     const convoWithImages = { ...convo, last_message: updatedLastMessage,
//       messages: updatedMessages
//      };

//     try {
//       const docRef = doc(db, "conversations_duo", id);
//       await setDoc(docRef, convoWithImages);
//       console.log(`Uploaded duo conversation ${id}`);
//     } catch (error) {
//       console.error(`Error uploading duo ${id}:`, error);
//     }
//   }
// }

async function uploadDuoConversations(conversationsDuo) {
  for (const [id, convo] of Object.entries(conversationsDuo)) {

    // Destructure messages and remove from group object
    const { messages, ...convoMeta } = convo;

    // Convert last_message image to base64 if needed
    const updatedLastMessage = getBase64IfImage(convo.last_message);
    const convoDoc = {
      ...convoMeta,
      last_message: updatedLastMessage
    };

    try {
      const docRef = doc(db, "conversations_duo", id);

      // Upload group metadata (without messages)
      await setDoc(docRef, convoDoc);

      // Upload each message as a document in the subcollection
      const messagesColRef = collection(docRef, "messages");

      for (const [msgId, msgObj] of Object.entries(messages)) {
        const updatedMsg = getBase64IfImage(msgObj);
        const msgDocRef = doc(messagesColRef, msgId);
        await setDoc(msgDocRef, updatedMsg);
      }

      console.log(`Uploaded duo conversation ${id}`);
    } catch (error) {
      console.error(`Error uploading duo ${id}:`, error);
    }
  }
}

async function uploadMessages(messages) {
  try {
    // Iterate over each convoId in the messages object
    for (const convoId in messages) {
      if (!messages.hasOwnProperty(convoId)) continue;

      const convoMessages = messages[convoId];
      const updatedMessages = convoMessages.map(getBase64IfImage);
      // Reference to the messages subcollection inside this convo
      const messagesCollectionRef = collection(db, "messages", convoId, "messages");

      // Upload each message in the conversation
      for (const message of updatedMessages) {
        const msgDocRef = doc(messagesCollectionRef, message.msg_id); // use msg_id as doc id

        // Prepare message data (remove msg_id since it's doc id)
        const { msg_id, ...messageData } = message;

        // Save the message document
        await setDoc(msgDocRef, messageData);
      }
    }

    console.log("Messages uploaded successfully!");
  } catch (error) {
    console.error("Error uploading messages:", error);
  }
}

// uploadUsers(users);


uploadGroupConversations(data.conversations_groups)
uploadDuoConversations(data.conversations_duo)
// uploadMessages(data.messages)