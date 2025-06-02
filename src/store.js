import { configureStore } from "@reduxjs/toolkit";
import { data } from "./data";

const { dataReducer } = require("./redux/reducers/dataReducer");

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('dataState');
    if (!serializedState) return undefined;
    const parsed = JSON.parse(serializedState);

    console.log("store load state", data, parsed)
    const result =  {
      ...data, // your initial state fallback
      ...parsed

    };
    console.log("store load state result", result)
    // return parsed
  } catch (e) {
    console.error("Failed to load state", e);
    return data; // fallback initial state
  }
};

const saveState = (state) => {
  try {
    // Save only parts you want persisted
    const persistState = {
      session_details: { 
        current_user_details : state.session_details.curent_user_details,    
      },
      users: state.users,
    };
    const serializedState = JSON.stringify(persistState);
    localStorage.setItem('dataState', serializedState);
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

const preloadedState = {
  dataReducer: loadState(),
};



export const store = configureStore({
  reducer: { dataReducer },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState().dataReducer);
});