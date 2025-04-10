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
    // setDogLogs([
    //   {
    //     dogLogId: "4Au003R97PHXEPREDgs6",
    //     notes: [],
    //     tourList: [],
    //     breedType: "英国牧羊犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 35,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "sheepdog english",
    //   },
    //   {
    //     dogLogId: "4ifcGUAi6lzPLH4tIETk",
    //     notes: [],
    //     breedType: "俄罗斯狼犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 0,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "borzoi",
    //   },
    //   {
    //     dogLogId: "56P1xzYMvGZpy3JVo7Bc",
    //     notes: [],
    //     tourList: [],
    //     breedType: "西施犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "shihtzu",
    //   },
    //   {
    //     dogLogId: "CchrNMOojJRSLnxjqPsG",
    //     notes: [],
    //     tourList: [],
    //     breedType: "马尔济斯犬",
    //     dogName: "222",
    //     weight: "",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-03-31",
    //     endDate: "2025-04-09",
    //     breedName: "maltese",
    //   },
    //   {
    //     dogLogId: "DSkYtoonThjtKic5RQWD",
    //     breedType: "秋田犬",
    //     dogName: "222",
    //     dailyPrice: 40,
    //     ownerName: "22",
    //     contactNo: "33",
    //     startDate: "2025-04-09",
    //     endDate: "2025-05-22",
    //     breedName: "akita",
    //     notes: ["66666"],
    //     weight: "2",
    //   },
    //   {
    //     dogLogId: "FsjExrShxz1uEOUX61EM",
    //     notes: [],
    //     tourList: [],
    //     breedType: "沙皮犬",
    //     dogName: "傻逼",
    //     weight: "",
    //     dailyPrice: 35,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-09",
    //     endDate: "2025-05-08",
    //     breedName: "sharpei",
    //   },
    //   {
    //     dogLogId: "G6Fj02NpAmF81SkkzkVa",
    //     notes: [],
    //     breedType: "比格犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "beagle",
    //   },
    //   {
    //     dogLogId: "GKU1ACzft2nS11Too1iu",
    //     notes: [],
    //     tourList: [],
    //     breedType: "非洲犬",
    //     dogName: "666",
    //     weight: "23",
    //     dailyPrice: 35,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-03-12",
    //     endDate: "2025-03-31",
    //     breedName: "african",
    //   },
    //   {
    //     dogLogId: "MYkGTYDocKwJtDI4Pfb6",
    //     notes: [],
    //     tourList: [],
    //     breedType: "圣伯纳犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 50,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "stbernard",
    //   },
    //   {
    //     dogLogId: "NHIWRTv7naWjL64ZWpdm",
    //     notes: [],
    //     tourList: [],
    //     breedType: "中型贵宾犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "poodle medium",
    //   },
    //   {
    //     dogLogId: "R0nS64XA4jOI7JrwX8TQ",
    //     notes: [],
    //     tourList: [],
    //     breedType: "猴面梗",
    //     dogName: "22",
    //     weight: "22",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-16",
    //     endDate: "2025-04-30",
    //     breedName: "affenpinscher",
    //   },
    //   {
    //     dogLogId: "R701wTKudoZuousHEtPh",
    //     notes: [],
    //     tourList: [],
    //     breedType: "马尔济斯犬",
    //     dogName: "hello",
    //     weight: "5",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-03-31",
    //     endDate: "2025-04-15",
    //     breedName: "maltese",
    //   },
    //   {
    //     dogLogId: "SEK3kPwrjGm5P2vpQX8k",
    //     notes: [],
    //     tourList: [],
    //     breedType: "圣伯纳犬",
    //     dogName: "2222",
    //     weight: "",
    //     dailyPrice: 50,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-14",
    //     breedName: "stbernard",
    //   },
    //   {
    //     dogLogId: "TQ0syKVHLhR7WWQRunT8",
    //     notes: [],
    //     tourList: [],
    //     breedType: "戈登塞特犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 35,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "setter gordon",
    //   },
    //   {
    //     dogLogId: "U10AipAO4nYMAbDxdFDX",
    //     notes: [],
    //     tourList: [],
    //     breedType: "秋田犬",
    //     dogName: "大叔",
    //     weight: "15",
    //     dailyPrice: 40,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-02-24",
    //     endDate: "2025-02-28",
    //     breedName: "akita",
    //   },
    //   {
    //     dogLogId: "WOOsJCFJc9pCN3gQHtLS",
    //     notes: [],
    //     tourList: [],
    //     breedType: "荷兰毛狮犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 35,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "keeshond",
    //   },
    //   {
    //     dogLogId: "er70FIFDY9nuUHzevsAg",
    //     notes: [],
    //     tourList: [],
    //     breedType: "柴犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "shiba",
    //   },
    //   {
    //     dogLogId: "l4CaorVEIlXtI0pwS4pE",
    //     notes: [],
    //     tourList: [],
    //     breedType: "阿彭策尔山犬",
    //     dogName: "222",
    //     weight: "",
    //     dailyPrice: 35,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-17",
    //     endDate: "2025-04-24",
    //     breedName: "appenzeller",
    //   },
    //   {
    //     dogLogId: "oedgca3ZOdfPX80rkKsB",
    //     tourList: [],
    //     breedType: "意大利灵缇犬",
    //     dogName: "Heidi",
    //     weight: "7.5",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-21",
    //     breedName: "greyhound italian",
    //     notes: ["每天两斤尿！", "每天一斤屎"],
    //   },
    //   {
    //     dogLogId: "yWDrrCukJ8RICVCtXkGp",
    //     notes: [],
    //     tourList: [],
    //     breedType: "比熊犬",
    //     dogName: "22",
    //     weight: "",
    //     dailyPrice: 30,
    //     ownerName: "",
    //     contactNo: "",
    //     startDate: "2025-04-10",
    //     endDate: "2025-05-06",
    //     breedName: "frise bichon",
    //   },
    // ]);

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
              <>
                <section>狗狗数量：{listData.activeCount}</section>
                <section>新增：{listData.startingCount}</section>
                <section>接走：{listData.endingCount}</section>
                <ViewDogLogsList data={listData} afterModify={refreshLog} />
              </>
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
