import { Calendar, CalendarProps, ConfigProvider, Spin } from "antd";

import zhCN from "antd/es/locale/zh_CN";

import { Dayjs } from "dayjs";

import { DailyDataStructure } from "@/Interface/dashboardInterface";

import { DogTourInfo } from "@/Interface/dogTourInterface";

import ViewDogLogsList from "@/Components/ViewDogLogsList";

import { _analyzeDogToursByDate, _analyzeDogToursByMonth } from "../helper";

interface Props {
  isLoadingData: boolean;
  tours: DogTourInfo[];
  refreshTour: () => void;
}

function CalendarView(props: Props) {
  const { isLoadingData, tours, refreshTour } = props;

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);

    if (info.type === "month") return monthCellRender(current);

    return info.originNode;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData: DailyDataStructure = _analyzeDogToursByDate(
      tours,
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
                  <section>
                    狗狗数量：
                    {getDogDisplayNumber(listData)}
                  </section>
                  {listData.startingCount ? (
                    <section style={{ color: "#dd3" }}>
                      新增：{listData.startingCount}
                    </section>
                  ) : null}
                  {listData.endingCount ? (
                    <section style={{ color: "#f00" }}>
                      接走：{listData.endingCount}
                    </section>
                  ) : null}
                </div>
                <ViewDogLogsList data={listData} afterModify={refreshTour} />
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
    const res = _analyzeDogToursByMonth(tours, value.format("YYYY-MM"));

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

  const getDogDisplayNumber = (listData: DailyDataStructure) => {
    const { activeDogs, startingDogs, endingDogs } = listData;

    const startingMap = new Map(startingDogs.map((dog) => [dog.dogId, dog]));
    const overlappingDogs = endingDogs.filter((dog) =>
      startingMap.has(dog.dogId)
    );

    const maxCount =
      activeDogs.length +
      startingDogs.length +
      endingDogs.length -
      overlappingDogs.length;

    const minCount = Math.max(0, maxCount - endingDogs.length);

    return maxCount === minCount ? maxCount : `${maxCount} (${minCount})`;
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Calendar cellRender={cellRender} />
    </ConfigProvider>
  );
}

export default CalendarView;
