import { DogInfo, DogInfoCreate } from "@/Interface/dogInterface";
import { http } from "@/util";

export const createDog = async (dog: DogInfoCreate) => {
  try {
    const response = await http.request({
      url: "dogs/createDog",
      method: "POST",
      data: dog,
    });

    return response.data;
  } catch (error) {
    return {
      error,
    };
  }
};

export const updateDog = async (dog: DogInfo) => {
  try {
    const response = await http.request({
      url: "dogs/updateDog",
      method: "PUT",
      data: dog,
    });

    return response.data;
  } catch (error) {
    return { error };
  }
};

export const removeDog = async (dog: DogInfo) => {
  try {
    const response = await http.request({
      url: "dogs/removeDog",
      method: "DELETE",
      data: dog,
    });

    return response.data;
  } catch (error) {
    return { error };
  }
};
