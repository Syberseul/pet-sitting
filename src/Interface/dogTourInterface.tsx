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
}
