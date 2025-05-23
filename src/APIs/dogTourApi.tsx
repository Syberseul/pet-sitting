import {
  CreateTourFail,
  CreateTourSuccess,
  DogTourInfo,
  getToursFail,
  getToursSuccess,
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

export const updateTour = async (
  tour: DogTourInfo
): Promise<CreateTourSuccess | CreateTourFail> => {
  try {
    const response = await http.request({
      url: `/tour/updateTour/${tour.uid}`,
      method: "PUT",
      data: tour,
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateTourFail;
    return apiError;
  }
};

export const deleteTour = async (
  id: string
): Promise<CreateTourSuccess | CreateTourFail> => {
  try {
    const response = await http.request({
      url: `tour/removeTour/${id}`,
      method: "DELETE",
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateTourFail;
    return apiError;
  }
};

export const getTours = async (): Promise<getToursSuccess | getToursFail> => {
  try {
    const response = await http.request({
      url: "tour/getTours",
      method: "GET",
    });

    return response;
  } catch (error) {
    const apiError = error as getToursFail;
    return apiError;
  }
};
