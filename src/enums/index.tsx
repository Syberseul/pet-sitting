export enum DogSize {
  X_SMALL = "超小型犬",
  SMALL = "小型犬",
  MEDIUM = "中型犬",
  LARGE = "大型犬",
  X_LARGE = "超大型犬",
}

export enum UserRole {
  "ADMIN" = 100,
  "DEVELOPER" = 90,
  "DOG_OWNER" = 10,
  "VISITOR" = 0,
}

export enum Display {
  "FORM" = "form",
  "COLLAPSE" = "collapse",
}

export enum DashboardView {
  "CALENDAR" = "calendar",
  "TIMELINE" = "timeline",
}

export enum TourStatus {
  "PENDING" = 0,
  "DELIVERED" = 1,
  "FINISHED" = 2,
  "PENDING_APPROVAL" = 3,
  "RECEIVING_APPROVED" = 4,
}
