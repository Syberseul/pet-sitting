import store, { RootState } from "@/store";

export const useUserState = (): RootState["user"] => store.getState().user;
