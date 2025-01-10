import { configureStore } from "@reduxjs/toolkit";

const rootReducer = {
  // Add your reducers here
};

export const store = configureStore({
  reducer: rootReducer,
});
