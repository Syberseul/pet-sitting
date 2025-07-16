import { getTours } from "@/APIs/dogTourApi";

import LoadingList from "@/Components/LoadingList";

import { useI18n } from "@/Context/languageContext";

import {
  DogTourInfo,
  getDogOwnerTourSuccess,
  isGetDogOwnerTourSuccess,
} from "@/Interface/dogTourInterface";
import { Alert, Avatar, Button, List, Space } from "antd";

import { useEffect, useState } from "react";

const ALERT_COUNTDOWN = 3000;

interface ListData {
  title: string;
  description: string;
  avatar?: string;
  content?: string;
}

function TourList() {
  const [listData, setListData] = useState<ListData[]>([]);
  // const [refreshFlag, setRefreshFlag] = useState(0);
  const [isFetchingTours, setIsFetchingTours] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [alertCountdown, setAlertCountdown] = useState(ALERT_COUNTDOWN);

  const { t } = useI18n();

  // useEffect(() => {
  //   fetchOwnerTours();
  // }, [refreshFlag]);

  useEffect(() => {
    fetchOwnerTours();
  }, []);

  useEffect(() => {
    if (alertVisible) {
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, ALERT_COUNTDOWN);

      const interval = setInterval(() => {
        setAlertCountdown((prev) => (prev >= 1000 ? prev - 1000 : 0));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setAlertCountdown(ALERT_COUNTDOWN);
    }
  }, [alertVisible]);

  const fetchOwnerTours = async () => {
    setIsFetchingTours(true);

    const tours = await getTours();

    if (isGetDogOwnerTourSuccess(tours as getDogOwnerTourSuccess)) {
      const {
        data: { tours: ts },
      } = tours as getDogOwnerTourSuccess;
      setListData(formatListData(ts));
    }

    setIsFetchingTours(false);
  };

  // const refreshTour = () => {
  //   setRefreshFlag((prev) => prev + 1);
  // };

  const formatListData = (obj: {
    [key: string]: DogTourInfo[];
  }): ListData[] => {
    const res: ListData[] = [];

    for (const arr of Object.values(obj)) {
      const { startDate, endDate } = arr[0];
      const title = `${startDate} - ${endDate} ${
        arr.length > 1 ? `(${arr.length} dogs)` : ""
      }`;
      const estimateDailyCharge = arr.reduce(
        (sum, { dailyPrice }) => (sum += dailyPrice),
        0
      );
      res.push({
        title,
        description: `Daily Estimate: ${estimateDailyCharge}`,
      });
    }

    return res;
  };

  return (
    <>
      {isFetchingTours ? (
        <LoadingList />
      ) : (
        <>
          {alertVisible ? (
            <Alert
              message={t.notice}
              description={t.tourListHeaderNotice}
              type="info"
              showIcon
              closable
              action={
                <Space>
                  <Button color="default" variant="text" disabled>
                    Close in {alertCountdown / 1000} Seconds
                  </Button>
                </Space>
              }
            />
          ) : null}
          <List
            itemLayout="vertical"
            size="large"
            dataSource={listData}
            footer={<div>{/* <b>ant design</b> footer part */}</div>}
            renderItem={(item) => (
              <List.Item key={item.title}>
                <List.Item.Meta
                  avatar={item.avatar ? <Avatar src={item.avatar} /> : null}
                  title={item.title}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
        </>
      )}
    </>
  );
}

export default TourList;
