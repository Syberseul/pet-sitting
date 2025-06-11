import {
  DailyDataStructure,
  DailyEventType,
  DailyEventTypeColor,
  MonthlyDateStructure,
} from "@/Interface/dashboardInterface";

import { DogTourInfo, timelineTourInfo } from "@/Interface/dogTourInterface";
import {
  IssuesCloseOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

export const _analyzeDogToursByDate = (
  tours: DogTourInfo[],
  date: string
): DailyDataStructure => {
  const activeDogs: DogTourInfo[] = [];
  const endingDogs: DogTourInfo[] = [];
  const startingDogs: DogTourInfo[] = [];

  const targetDate = dayjs(date);

  tours.forEach((tour) => {
    const logStart = dayjs(tour.startDate);
    const logEnd = dayjs(tour.endDate);

    if (logStart.isSame(logEnd, "day")) {
      if (logStart.isSame(targetDate, "day")) {
        startingDogs.push({ ...tour, iconType: DailyEventType.WARNING });
        endingDogs.push({ ...tour, iconType: DailyEventType.ERROR });
      }
    } else {
      if (logStart.isSame(targetDate, "day")) {
        startingDogs.push({ ...tour, iconType: DailyEventType.WARNING });
      } else if (logEnd.isSame(targetDate, "day")) {
        endingDogs.push({ ...tour, iconType: DailyEventType.ERROR });
      } else if (
        targetDate.isAfter(logStart, "day") &&
        targetDate.isBefore(logEnd, "day")
      ) {
        activeDogs.push({ ...tour, iconType: DailyEventType.SUCCESS });
      }
    }
  });

  return {
    activeCount: activeDogs.length,
    endingCount: endingDogs.length,
    startingCount: startingDogs.length,
    activeDogs,
    endingDogs,
    startingDogs,
  };
};

export const _analyzeDogToursByMonth = (
  tours: DogTourInfo[],
  month: string
): MonthlyDateStructure => {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("月份格式应为 YYYY-MM");
  }

  const monthStart = dayjs(`${month}-01`);
  const monthEnd = monthStart.endOf("month");

  const relevantLogs = tours.filter((log) => {
    const logStart = dayjs(log.startDate);
    const logEnd = dayjs(log.endDate);
    return (
      (logStart.isBefore(monthEnd) || logStart.isSame(monthEnd)) &&
      (logEnd.isAfter(monthStart) || logEnd.isSame(monthStart))
    );
  });

  if (!relevantLogs.length) {
    return {
      date: month,
      highest: 0,
      lowest: 0,
      newDog: 0,
      leftDog: 0,
    };
  }

  const dayCounts: Record<string, number> = {};

  for (
    let day = monthStart;
    day.isBefore(monthEnd) || day.isSame(monthEnd);
    day = day.add(1, "day")
  ) {
    const dateStr = day.format("YYYY-MM-DD");
    dayCounts[dateStr] = relevantLogs.filter((log) => {
      const logStart = dayjs(log.startDate);
      const logEnd = dayjs(log.endDate);
      return (
        (day.isAfter(logStart) || day.isSame(logStart)) &&
        (day.isBefore(logEnd) || day.isSame(logEnd))
      );
    }).length;
  }

  const counts = Object.values(dayCounts);

  const newLogs = relevantLogs.filter((log) =>
    dayjs(log.startDate).isSame(monthStart, "month")
  ).length;

  const leftLogs = relevantLogs.filter((log) =>
    dayjs(log.endDate).isSame(monthStart, "month")
  ).length;

  return {
    date: month,
    highest: counts.length ? Math.max(...counts) : 0,
    lowest: counts.length ? Math.min(...counts) : 0,
    newDog: newLogs,
    leftDog: leftLogs,
  };
};

export const _analyzeDogToursByTimeLine = (tours: DogTourInfo[]) => {
  let generatedTours: timelineTourInfo[] = [];

  tours.map((tour) => {
    const { startDate, endDate } = tour;

    if (!startDate || !endDate) return;

    const isSameDayEvent = startDate === endDate;

    const startEvent = {
      tourInfo: tour,
      displayDate: startDate,
      isSameDayEvent,
    };

    generatedTours.push(startEvent);

    if (!isSameDayEvent)
      generatedTours.push({
        ...startEvent,
        displayDate: endDate,
      });
  });

  generatedTours.sort((a, b) => (a.displayDate > b.displayDate ? 1 : -1));

  if (generatedTours.length > 0) {
    let lastDisplayDate = generatedTours[0].displayDate;
    generatedTours[0].icon = __getTimelineIcon(generatedTours[0]);

    for (let i = 1; i < generatedTours.length; i++) {
      const currTour = generatedTours[i];
      const { displayDate } = currTour;

      currTour.icon = __getTimelineIcon(currTour);

      if (displayDate === lastDisplayDate) currTour.displayDate = "";
      else lastDisplayDate = currTour.displayDate;
    }
  }

  return generatedTours;
};

const __getTimelineIcon = (
  timelineTourInfo: timelineTourInfo
): React.ReactNode | null => {
  const {
    tourInfo: { startDate, endDate },
    isSameDayEvent,
    displayDate,
  } = timelineTourInfo;

  if (isSameDayEvent)
    return (
      <IssuesCloseOutlined style={{ color: DailyEventTypeColor.warning }} />
    );
  else if (displayDate === startDate)
    return <LoginOutlined style={{ color: DailyEventTypeColor.success }} />;
  else if (displayDate === endDate)
    return <LogoutOutlined style={{ color: DailyEventTypeColor.error }} />;
  else return null;
};
