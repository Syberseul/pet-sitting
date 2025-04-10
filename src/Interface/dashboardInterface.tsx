import { DailyCalendarDogDetail } from "./dogInterface";

export interface DailyDataStructure {
  activeCount: number;
  endingCount: number;
  startingCount: number;
  activeDogs: DailyCalendarDogDetail[];
  endingDogs: DailyCalendarDogDetail[];
  startingDogs: DailyCalendarDogDetail[];
}

export interface MonthlyDateStructure {
  date: string;
  highest: number;
  lowest: number;
  newDog: number;
  leftDog: number;
}

export enum DailyEventType {
  WARNING = "warning",
  SUCCESS = "success",
  ERROR = "error",
}

export enum DailyEventTypeColor {
  warning = "#fadd14",
  success = "#52c41a",
  error = "#ff4d4f",
}

export enum CalendarType {
  DATE = "date",
  MONTH = "month",
}
