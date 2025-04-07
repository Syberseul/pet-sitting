import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./modules/userStore";

const loadPreloadedState = () => {
  try {
    const serializedState = localStorage.getItem("userInfo");
    return serializedState ? { user: JSON.parse(serializedState) } : undefined;
  } catch (e) {
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: loadPreloadedState(),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
