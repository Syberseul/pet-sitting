import { Calendar, CalendarProps, ConfigProvider, Spin } from "antd";

import zhCN from "antd/es/locale/zh_CN";
import enUS from "antd/es/locale/en_US";

import { Dayjs } from "dayjs";

import { DailyDataStructure } from "@/Interface/dashboardInterface";

import { DogTourInfo } from "@/Interface/dogTourInterface";

import ViewDogLogsList from "@/Components/ViewDogLogsList";

import { _analyzeDogToursByDate, _analyzeDogToursByMonth } from "../helper";
import { useI18n } from "@/Context/languageContext";
import { useEffect, useState } from "react";

interface Props {
  isLoadingData: boolean;
  tours: DogTourInfo[];
  refreshTour: () => void;
}

function CalendarView(props: Props) {
  const { isLoadingData, tours, refreshTour } = props;
  const [calendarLanguage, setCalendarLanguage] = useState(zhCN);

  const { t, language } = useI18n();

  useEffect(() => {
    setCalendarLanguage(language === "en" ? enUS : zhCN);
  }, [language]);

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
          <Spin size="small">{t.loading}</Spin>
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
                    {t.dogAmount}:{getDogDisplayNumber(listData)}
                  </section>
                  {listData.startingCount ? (
                    <section style={{ color: "#dd3" }}>
                      {t.newTourAmount}: {listData.startingCount}
                    </section>
                  ) : null}
                  {listData.endingCount ? (
                    <section style={{ color: "#f00" }}>
                      {t.finishTourAmount}: {listData.endingCount}
                    </section>
                  ) : null}
                </div>
                <ViewDogLogsList data={listData} afterModify={refreshTour} />
              </div>
            ) : (
              <section>{t.noTourText}</section>
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
          <Spin size="small">{t.loading}...</Spin>
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
                    {t.monthlyMax}:
                    <span style={{ color: "#fa0" }}>{res.highest}</span>
                  </section>
                  <section>
                    {t.monthlyMin}:
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
                      {t.monthlyNewTours}:
                      <span style={{ color: "#dd3" }}>{res.newDog}</span>
                    </section>
                    <section>
                      {t.monthlyFinishTours}:
                      <span style={{ color: "#f00" }}>{res.leftDog}</span>
                    </section>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <section>{t.noTourText}</section>
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
    <ConfigProvider locale={calendarLanguage}>
      <Calendar cellRender={cellRender} />
    </ConfigProvider>
  );
}

export default CalendarView;
