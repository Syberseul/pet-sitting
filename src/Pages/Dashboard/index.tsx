import { getAllDogLogs, isFetchDogDataSuccess } from "@/APIs/dogApi";

import CreateDogLog from "@/Components/CreateDogLog";

import {
  DailyCalendarDogDetail,
  DogFormDetails,
} from "@/Interface/dogInterface";

import type { CalendarProps } from "antd";

import { Calendar, ConfigProvider, Spin } from "antd";

import type { Dayjs } from "dayjs";

import { useEffect, useState } from "react";

import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import {
  DailyDataStructure,
  DailyEventType,
  MonthlyDateStructure,
} from "@/Interface/dashboardInterface";

import "./index.scss";

import ViewDogLogsList from "@/Components/ViewDogLogsList";

dayjs.locale("zh-cn");

const Dashboard: React.FC = () => {
  const [dogLogs, setDogLogs] = useState<DogFormDetails[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  useEffect(() => {
    fetchAllData();
  }, [refreshFlag]);

  const fetchAllData = async () => {
    setIsLoadingData(true);

    const res = await getAllDogLogs();

    if (isFetchDogDataSuccess(res)) setDogLogs(res);

    setIsLoadingData(false);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData: DailyDataStructure = _analyzeDogLogsByDate(
      dogLogs,
      value.format("YYYY-MM-DD")
    );

    const { activeCount, startingCount, endingCount } = listData;

    return (
      <>
        {isLoadingData ? (
          <Spin size="small">加载中</Spin>
        ) : (
          <>
            {activeCount || startingCount || endingCount ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                }}
              >
                <div>
                  <section>狗狗数量：{listData.activeCount}</section>
                  <section>新增：{listData.startingCount}</section>
                  <section>接走：{listData.endingCount}</section>
                </div>
                <ViewDogLogsList data={listData} afterModify={refreshLog} />
              </div>
            ) : (
              <section>没有狗狗...</section>
            )}
          </>
        )}
      </>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const res = _analyzeDogLogsByMonth(dogLogs, value.format("YYYY-MM"));

    const { highest, lowest, newDog, leftDog } = res;

    return (
      <>
        {isLoadingData ? (
          <Spin size="small">加载中...</Spin>
        ) : (
          <div
            className="notes-month"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {highest || lowest || newDog || leftDog ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "10px",
                  }}
                >
                  <section>
                    本月峰值：
                    <span style={{ color: "#fa0" }}>{res.highest}</span>
                  </section>
                  <section>
                    本月低谷：
                    <span style={{ color: "#6ff" }}>{res.lowest}</span>
                  </section>
                </div>
                {newDog || leftDog ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: "10px",
                    }}
                  >
                    <section>
                      本月新狗狗：
                      <span style={{ color: "#dd3" }}>{res.newDog}</span>
                    </section>
                    <section>
                      本月送走狗狗：
                      <span style={{ color: "#f00" }}>{res.leftDog}</span>
                    </section>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <section>没有狗狗...</section>
            )}
          </div>
        )}
      </>
    );
  };

  const _analyzeDogLogsByDate = (
    logs: DogFormDetails[],
    date: string
  ): DailyDataStructure => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }

    const activeDogs: DailyCalendarDogDetail[] = [],
      endingDogs: DailyCalendarDogDetail[] = [],
      startingDogs: DailyCalendarDogDetail[] = [];

    const targetDate = dayjs(date);

    logs.forEach((log) => {
      const logStart = dayjs(log.startDate);
      const logEnd = dayjs(log.endDate);

      const dog = {
        dogName: log.dogName,
        dogLogId: log.dogLogId as string,
        breedType: log.breedType,
      };

      if (logStart.isSame(targetDate))
        startingDogs.push({
          ...dog,
          iconType: DailyEventType.WARNING,
        });

      if (logEnd.isSame(targetDate))
        endingDogs.push({
          ...dog,
          iconType: DailyEventType.ERROR,
        });

      if (targetDate.isAfter(logStart) && targetDate.isBefore(logEnd)) {
        activeDogs.push({
          ...dog,
          iconType: DailyEventType.SUCCESS,
        });
      }
    });

    return {
      activeCount: activeDogs.length + endingDogs.length + startingDogs.length,
      endingCount: endingDogs.length,
      startingCount: startingDogs.length,
      activeDogs: activeDogs,
      endingDogs: endingDogs,
      startingDogs: startingDogs,
    };
  };

  const _analyzeDogLogsByMonth = (
    logs: DogFormDetails[],
    month: string
  ): MonthlyDateStructure => {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new Error("月份格式应为 YYYY-MM");
    }

    const monthStart = dayjs(`${month}-01`);
    const monthEnd = monthStart.endOf("month");

    const relevantLogs = logs.filter((log) => {
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

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);

    if (info.type === "month") return monthCellRender(current);

    return info.originNode;
  };

  const refreshLog = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <>
      <CreateDogLog afterCreate={refreshLog} />

      <ConfigProvider locale={zhCN}>
        <Calendar cellRender={cellRender} />;
      </ConfigProvider>
    </>
  );
};

export default Dashboard;
