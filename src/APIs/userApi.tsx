import { ApiResponse, errorStructure } from "@/Interface/apiInterface";
import { UserData, UserStoreData } from "@/Interface/userInterface";
import { http } from "@/util";

export const signUp = async (
  user: UserData
): Promise<{ data?: ApiResponse<UserStoreData>; error?: errorStructure }> => {
  try {
    const { data } = await http.request<ApiResponse<UserStoreData>>({
      // 修改这里
      url: "/register",
      method: "POST",
      data: user,
    });
    return { data };
  } catch (error: any) {
    return { error };
  }
};
