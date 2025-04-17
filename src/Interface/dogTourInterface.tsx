export interface DogTourInfo extends NewDogTourInfo {
  uid: string;
}

export interface NewDogTourInfo {
  dogId: string;
  dogName: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  notes: string[];
  dailyPrice: number;
  weight: number;
  checked: boolean;
  [key: string]: any;
}

export interface CreateTourSuccess {
  data: DogTourInfo;
}

export interface CreateTourFail {
  error: string;
  details: string;
}

export const isCreateTourSuccess = (
  res: CreateTourSuccess | CreateTourFail
) => {
  return (res as CreateTourSuccess).data.uid != undefined;
};

export interface getToursSuccess {
  data: DogTourInfo[];
}

export interface getToursFail {
  error: string;
  details: string;
}

export const isGetTourSuccess = (res: getToursSuccess | getToursFail) => {
  return !(res as getToursFail).error;
};
