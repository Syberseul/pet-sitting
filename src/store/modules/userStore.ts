import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserStoreData } from "@/Interface/userInterface";

const initialUserDataState: UserStoreData = {
  email: "",
  name: "",
  token: "",
  refresh_token: "",
  role: 11,
};

const userStore = createSlice({
  name: "user",
  initialState: initialUserDataState,
  reducers: {
    userLogin(state, action: PayloadAction<UserStoreData>) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.refresh_token = action.payload.refresh_token;
      state.role = action.payload.role;

      localStorage.setItem("userInfo", JSON.stringify(state));
    },
    userLogout(state) {
      Object.assign(state, initialUserDataState);
      localStorage.removeItem("userInfo");
    },
  },
});

const { userLogin, userLogout } = userStore.actions;

const reducer = userStore.reducer;

export { userLogin, userLogout };

export default reducer;
