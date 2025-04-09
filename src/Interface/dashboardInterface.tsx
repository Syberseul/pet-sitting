export interface DailyDataStructure {
  type: DailyEventType;
  dogName: string;
  dogLogId: string;
  date: string;
}

export interface MonthlyDateStructure {
  date: string;
  highest: number;
  lowest: number;
  new: number;
  left: number;
}

export enum DailyEventType {
  WARNING = "warning",
  SUCCESS = "success",
  ERROR = "error",
}

export enum CalendarType {
  DATE = "date",
  MONTH = "month",
}
