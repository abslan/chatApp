import { createSlice } from "@reduxjs/toolkit";
// import { startTimer, pauseTimer, resetTimer} from "./timerReducer";

const INITIAL_STATE = { message: null };

// create alert slice to handle start, pause, timer actions below
export const alertSlice = createSlice({
    name : "alert",
    initialState: INITIAL_STATE,
    reducers: {
        reset : (state, action) => {
            state.message = null;
        }      
    },
    extraReducers : (builder) => {
        builder.addCase(startTimer, (state, action) => {
            state.message = "Timer has started.";
        })
        builder.addCase(pauseTimer, (state, action) => {
            state.message = "Time is paused.";
        })
        builder.addCase(resetTimer, (state, action) => {
            state.message = "Timer set to 0.";
        })
    }
})

// export the alert reducer function here
export const alertReducer = alertSlice.reducer;
export const alertActions = alertSlice.actions;

// create and export alert selector function here
export const alertSelector = (state) => state.alertReducer;
