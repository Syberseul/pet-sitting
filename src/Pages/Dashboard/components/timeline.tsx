import {
  DogTourInfo,
  isMarkTourFinishSuccess,
  timelineTourInfo,
} from "@/Interface/dogTourInterface";

import { Button, Card, Spin, Timeline } from "antd";

import { useEffect, useState } from "react";

import "../index.scss";

import { _analyzeDogToursByTimeLine } from "../helper";

import TimelineTourDetail from "./timelineTourDetail";

import { TourStatus } from "@/enums";

import { markTourFinish } from "@/APIs/dogTourApi";

interface Props {
  isLoadingData: boolean;
  tours: DogTourInfo[];
  refreshTour: () => void;
}

function TimelineView(props: Props) {
  const { isLoadingData, tours, refreshTour } = props;

  const [sortedTour, setSortedTour] = useState<timelineTourInfo[]>([]);
  const [detailedTour, setDetailedTour] = useState<DogTourInfo | null>(null);

  const [isMarkingTourFinish, setIsMarkingTourFinish] = useState(false);

  useEffect(() => {
    if (!isLoadingData) {
      getDisplayData();
    }
  }, [isLoadingData]);

  const getDisplayData = () => {
    setSortedTour(_analyzeDogToursByTimeLine(tours));
  };

  const closeViewDogTourInfo = () => {
    setDetailedTour(null);
  };

  const handleMarkTourFinish = async (data: DogTourInfo) => {
    setIsMarkingTourFinish(true);
    setDetailedTour(data);

    const res = await markTourFinish(data.uid);

    setIsMarkingTourFinish(false);

    setDetailedTour(null);

    if (isMarkTourFinishSuccess(res)) refreshTour();
  };

  return isLoadingData ? (
    <Spin></Spin>
  ) : (
    <div style={{ height: "80vh", display: "flex", columnGap: "20px" }}>
      <div style={{ height: "100%", width: "100%", maxWidth: 500 }}>
        <Card
          style={{
            minWidth: 200,
            maxWidth: 500,
            maxHeight: "100%",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Timeline
            mode="left"
            className="custom-timeline"
            items={[
              ...sortedTour.map((tour) => ({
                label: tour.displayDate,
                children: (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      onClick={() => {
                        setDetailedTour(tour.tourInfo);
                      }}
                    >
                      {tour.tourInfo.dogName}
                    </span>
                    {tour.tourInfo.status !== TourStatus.FINISHED ? (
                      <Button
                        type="primary"
                        loading={
                          detailedTour && detailedTour.uid === tour.tourInfo.uid
                            ? isMarkingTourFinish
                            : false
                        }
                        onClick={() => handleMarkTourFinish(tour.tourInfo)}
                      >
                        Mark as Finish
                      </Button>
                    ) : (
                      <Button color="danger" variant="outlined">
                        Finished
                      </Button>
                    )}
                  </div>
                ),
                dot: tour.icon ?? null,
              })),
            ]}
          />
        </Card>
      </div>
      {detailedTour ? (
        <TimelineTourDetail
          tourInfo={detailedTour}
          closeViewDogTourInfo={closeViewDogTourInfo}
        />
      ) : null}
    </div>
  );
}

export default TimelineView;
