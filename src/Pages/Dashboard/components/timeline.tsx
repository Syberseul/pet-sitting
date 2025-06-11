import { DogTourInfo, timelineTourInfo } from "@/Interface/dogTourInterface";
import { Card, Spin, Timeline } from "antd";
import { useEffect, useState } from "react";
import "../index.scss";
import { _analyzeDogToursByTimeLine } from "../helper";

import TimelineTourDetail from "./timelineTourDetail";

interface Props {
  isLoadingData: boolean;
  tours: DogTourInfo[];
  refreshTour: () => void;
}

function TimelineView(props: Props) {
  const { isLoadingData, tours, refreshTour } = props;

  const [sortedTour, setSortedTour] = useState<timelineTourInfo[]>([]);
  const [detailedTour, setDetailedTour] = useState<DogTourInfo | null>(null);

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
                  <span
                    onClick={() => {
                      setDetailedTour(tour.tourInfo);
                      console.log(tour.tourInfo);
                    }}
                  >
                    {tour.tourInfo.dogName}
                  </span>
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
