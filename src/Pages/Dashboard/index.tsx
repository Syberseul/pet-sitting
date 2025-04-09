// import { getAllDogLogs, isFetchDogDataSuccess } from "@/APIs/dogApi";

import CreateDogLog from "@/Components/CreateDogLog";

import { DogFormDetails } from "@/Interface/dogInterface";

import type { BadgeProps, CalendarProps } from "antd";

import { Badge, Calendar } from "antd";

import type { Dayjs } from "dayjs";

import { useEffect, useState } from "react";

import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import {
  DailyDataStructure,
  DailyEventType,
  MonthlyDateStructure,
} from "@/Interface/dashboardInterface";
import "./index.scss";
import EditDogLogModal from "@/Components/EditDogLog";

// 设置dayjs本地化
dayjs.locale("zh-cn");

const Dashboard: React.FC = () => {
  const [dogLogs, setDogLogs] = useState<DogFormDetails[]>([]);
  const [monthList, setMonthList] = useState<DailyDataStructure[]>([]);

  const [selectedUid, setSelectedUid] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData = async () => {
      // const res = await getAllDogLogs();

      // if (isFetchDogDataSuccess(res)) {
      //   setDogLogs(res);
      //   console.log(res);
      // }
      setDogLogs([
        {
          dogLogId: "4Au003R97PHXEPREDgs6",
          notes: [],
          tourList: [],
          breedType: "英国牧羊犬",
          dogName: "22",
          weight: "",
          dailyPrice: 35,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "sheepdog english",
        },
        {
          dogLogId: "4ifcGUAi6lzPLH4tIETk",
          notes: [],
          breedType: "俄罗斯狼犬",
          dogName: "22",
          weight: "",
          dailyPrice: 0,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "borzoi",
        },
        {
          dogLogId: "56P1xzYMvGZpy3JVo7Bc",
          notes: [],
          tourList: [],
          breedType: "西施犬",
          dogName: "22",
          weight: "",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "shihtzu",
        },
        {
          dogLogId: "CchrNMOojJRSLnxjqPsG",
          notes: [],
          tourList: [],
          breedType: "马尔济斯犬",
          dogName: "222",
          weight: "",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-03-31",
          endDate: "2025-04-09",
          breedName: "maltese",
        },
        {
          dogLogId: "DSkYtoonThjtKic5RQWD",
          breedType: "秋田犬",
          dogName: "222",
          dailyPrice: 40,
          ownerName: "22",
          contactNo: "33",
          startDate: "2025-04-09",
          endDate: "2025-05-22",
          breedName: "akita",
          notes: ["66666"],
          weight: "2",
        },
        {
          dogLogId: "FsjExrShxz1uEOUX61EM",
          notes: [],
          tourList: [],
          breedType: "沙皮犬",
          dogName: "傻逼",
          weight: "",
          dailyPrice: 35,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-09",
          endDate: "2025-05-08",
          breedName: "sharpei",
        },
        {
          dogLogId: "G6Fj02NpAmF81SkkzkVa",
          notes: [],
          breedType: "比格犬",
          dogName: "22",
          weight: "",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "beagle",
        },
        {
          dogLogId: "MYkGTYDocKwJtDI4Pfb6",
          notes: [],
          tourList: [],
          breedType: "圣伯纳犬",
          dogName: "22",
          weight: "",
          dailyPrice: 50,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "stbernard",
        },
        {
          dogLogId: "NHIWRTv7naWjL64ZWpdm",
          notes: [],
          tourList: [],
          breedType: "中型贵宾犬",
          dogName: "22",
          weight: "",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "poodle medium",
        },
        {
          dogLogId: "SEK3kPwrjGm5P2vpQX8k",
          notes: [],
          tourList: [],
          breedType: "圣伯纳犬",
          dogName: "2222",
          weight: "",
          dailyPrice: 50,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-14",
          breedName: "stbernard",
        },
        {
          dogLogId: "TQ0syKVHLhR7WWQRunT8",
          notes: [],
          tourList: [],
          breedType: "戈登塞特犬",
          dogName: "22",
          weight: "",
          dailyPrice: 35,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "setter gordon",
        },
        {
          dogLogId: "WOOsJCFJc9pCN3gQHtLS",
          notes: [],
          tourList: [],
          breedType: "荷兰毛狮犬",
          dogName: "22",
          weight: "",
          dailyPrice: 35,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "keeshond",
        },
        {
          dogLogId: "er70FIFDY9nuUHzevsAg",
          notes: [],
          tourList: [],
          breedType: "柴犬",
          dogName: "22",
          weight: "",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "shiba",
        },
        {
          dogLogId: "l4CaorVEIlXtI0pwS4pE",
          notes: [],
          tourList: [],
          breedType: "阿彭策尔山犬",
          dogName: "222",
          weight: "",
          dailyPrice: 35,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-17",
          endDate: "2025-04-24",
          breedName: "appenzeller",
        },
        {
          dogLogId: "oedgca3ZOdfPX80rkKsB",
          tourList: [],
          breedType: "意大利灵缇犬",
          dogName: "Heidi",
          weight: "7.5",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-21",
          breedName: "greyhound italian",
          notes: ["每天两斤尿！", "每天一斤屎"],
        },
        {
          dogLogId: "yWDrrCukJ8RICVCtXkGp",
          notes: [],
          tourList: [],
          breedType: "比熊犬",
          dogName: "22",
          weight: "",
          dailyPrice: 30,
          ownerName: "",
          contactNo: "",
          startDate: "2025-04-10",
          endDate: "2025-05-06",
          breedName: "frise bichon",
        },
      ]);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    mapData();
  }, [dogLogs]);

  const getListData = (value: Dayjs) => {
    const date = value.format("YYYY-MM-DD");

    return monthList.filter((data) => data.date == date);
  };

  const handleClickLog = (log: DailyDataStructure) => {
    const { dogLogId } = log;
    const targetLog = dogLogs.find((lg) => lg.dogLogId == dogLogId);

    if (!targetLog) return;

    setSelectedUid(dogLogId);
    setEditModalVisible(true);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <>
        {listData.map((item) => (
          <div
            key={item.dogLogId}
            onClick={() => handleClickLog(item)}
            className="hoverItem"
          >
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.dogName}
            />
          </div>
        ))}
      </>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const res = _analyzeDogLogsByMonth(dogLogs, value.format("YYYY-MM"));
    return (
      <div
        className="notes-month"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
        >
          <section>
            本月峰值：<span style={{ color: "#fa0" }}>{res.highest}</span>
          </section>
          <section>
            本月低谷：<span style={{ color: "#6ff" }}>{res.lowest}</span>
          </section>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
        >
          <section>
            本月新狗狗：<span style={{ color: "#dd3" }}>{res.new}</span>
          </section>
          <section>
            本月送走狗狗：<span style={{ color: "#f00" }}>{res.left}</span>
          </section>
        </div>
      </div>
    );
  };

  const mapData = () => {
    if (!dogLogs.length) return;

    const dailyList: DailyDataStructure[] = [];

    console.log(dogLogs);

    dogLogs.map((log) => {
      const { dogLogId, dogName, startDate } = log;

      const listData: DailyDataStructure = {
        type: _compareWithToday(startDate),
        dogName,
        dogLogId: dogLogId as string,
        date: startDate,
      };
      dailyList.push(listData);
    });

    setMonthList(dailyList);
  };

  const _compareWithToday = (dateStr: string): DailyEventType => {
    const date = dayjs(dateStr),
      today = dayjs().startOf("day");

    if (date.isBefore(today)) return DailyEventType.WARNING;
    else if (date.isAfter(today)) return DailyEventType.ERROR;
    return DailyEventType.SUCCESS;
  };

  const _analyzeDogLogsByMonth = (
    logs: DogFormDetails[],
    month: string
  ): MonthlyDateStructure => {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new Error("月份格式应为 YYYY-MM");
    }

    const monthStart = dayjs(`${month}-01`),
      monthEnd = monthStart.endOf("month");

    const relevantLogs = logs.filter((log) => {
      const logStart = dayjs(log.startDate);
      const logEnd = dayjs(log.endDate);
      return logStart.isBefore(monthEnd) && logEnd.isAfter(monthStart);
    });

    if (!relevantLogs.length)
      return {
        date: month,
        highest: 0,
        lowest: 0,
        new: 0,
        left: 0,
      };

    const dayCounts: Record<string, number> = {};
    for (
      let day = monthStart;
      day.isBefore(monthEnd);
      day = day.add(1, "day")
    ) {
      const dateStr = day.format("YYYY-MM-DD");
      dayCounts[dateStr] = relevantLogs.filter((log) => {
        const logStart = dayjs(log.startDate);
        const logEnd = dayjs(log.endDate);
        return day.isAfter(logStart) && day.isBefore(logEnd);
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
      highest: Math.max(...counts),
      lowest: Math.min(...counts),
      new: newLogs,
      left: leftLogs,
    };
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);

    if (info.type === "month") return monthCellRender(current);

    return info.originNode;
  };

  const handleCloseEditDogLogModal = () => {
    setSelectedUid("");
    setEditModalVisible(false);
  };

  return (
    <>
      <CreateDogLog />

      <ConfigProvider locale={zhCN}>
        <Calendar cellRender={cellRender} />;
      </ConfigProvider>

      <EditDogLogModal
        uid={selectedUid}
        visible={editModalVisible}
        onCancel={handleCloseEditDogLogModal}
        onSuccess={() => {
          handleCloseEditDogLogModal();
          // 可以在这里添加成功后的回调，如刷新列表
        }}
      />
    </>
  );
};

export default Dashboard;
