import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserRefreshTokenData, UserStoreData } from "@/Interface/userInterface";

const initialUserDataState: UserStoreData = {
  uid: "",
  email: "",
  username: "",
  token: "",
  refreshToken: "",
  role: 11,
};

const userStore = createSlice({
  name: "user",
  initialState: initialUserDataState,
  reducers: {
    userLogin(state, action: PayloadAction<UserStoreData>) {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role;
      state.uid = action.payload.uid;

      Object.assign(state, action.payload);
      localStorage.setItem("userInfo", JSON.stringify(state));
    },
    userLogout(state) {
      Object.assign(state, initialUserDataState);
      localStorage.removeItem("userInfo");
    },
    userRefreshToken(state, action: PayloadAction<UserRefreshTokenData>) {
      (state.email = action.payload.email),
        (state.token = action.payload.token),
        (state.refreshToken = action.payload.refreshToken),
        (state.uid = action.payload.uid);

      localStorage.setItem("userInfo", JSON.stringify(state));
    },
  },
});

const { userLogin, userLogout, userRefreshToken } = userStore.actions;

const reducer = userStore.reducer;

export { userLogin, userLogout, userRefreshToken };

export default reducer;
