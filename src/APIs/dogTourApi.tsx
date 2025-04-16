import {
  CreateTourFail,
  CreateTourSuccess,
  NewDogTourInfo,
} from "@/Interface/dogTourInterface";
import { http } from "@/util";

export const createTour = async (
  tour: NewDogTourInfo
): Promise<CreateTourSuccess | CreateTourFail> => {
  try {
    const response = await http.request({
      url: "/tour/createTour",
      method: "POST",
      data: tour,
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateTourFail;
    return apiError;
  }
};
