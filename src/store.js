import { configureStore } from "@reduxjs/toolkit";

const { dataReducer } = require("./redux/reducers/dataReducer");


export const store = configureStore({
  reducer: { dataReducer }
});
