import { DogInfo } from "./dogInterface";

export interface DogOwner {
  name: string;
  dogs: DogInfo[];
  isFromWx: boolean;
  wxId?: string;
  contactNo?: string;
  userId?: string;
  uid?: string;
}
