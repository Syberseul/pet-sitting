import { DogOwner } from "@/Interface/dogOwnerInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialDogOwnerState: DogOwner[] = [];

const dogOwnersStore = createSlice({
  name: "dogowners",
  initialState: initialDogOwnerState,
  reducers: {
    setDogOwners(_state, action: PayloadAction<DogOwner[]>) {
      return action.payload;
    },
    modifyDogOwner(state, action: PayloadAction<DogOwner>) {
      const owner = state.find((o) => o.uid === action.payload.uid);
      if (!owner) {
        state.push(action.payload);
      } else {
        const index = state.findIndex((o) => o.uid === action.payload.uid);
        state[index] = action.payload;
      }
    },
    removeDogOwner(state, action: PayloadAction<DogOwner>) {
      return state.filter((o) => o.uid !== action.payload.uid);
    },
  },
});

const { setDogOwners, modifyDogOwner, removeDogOwner } = dogOwnersStore.actions;

const reducer = dogOwnersStore.reducer;

export { setDogOwners, modifyDogOwner, removeDogOwner };

export default reducer;
