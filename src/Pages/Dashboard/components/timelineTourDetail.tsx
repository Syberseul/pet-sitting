import { useI18n } from "@/Context/languageContext";
import { DogTourInfo } from "@/Interface/dogTourInterface";
import { getDaysGap, getMaskedId } from "@/util/helper";
import {
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Card, Tag } from "antd";

interface Props {
  tourInfo: DogTourInfo;
  closeViewDogTourInfo: () => void;
}

function timelineTourDetail(props: Props) {
  const { tourInfo, closeViewDogTourInfo } = props;

  const { t } = useI18n();

  const getDogName = (tourInfo: DogTourInfo) => {
    const { dogName, dogId } = tourInfo;

    return `${dogName} (${getMaskedId(dogId)})`;
  };

  const getDogType = (tourInfo: DogTourInfo) => {
    const { breedName, breedType } = tourInfo;

    return `${breedType} (${breedName})`;
  };

  const getDesexTag = (tourInfo: DogTourInfo) => {
    const { desex } = tourInfo;

    return (
      <Tag color={desex ? "green" : "volcano"}>
        {desex ? (
          <span>
            <CheckOutlined /> {t.desex}
          </span>
        ) : (
          <span>
            <CloseOutlined /> {t.nonDesex}
          </span>
        )}
      </Tag>
    );
  };

  const getTourPeriod = (tourInfo: DogTourInfo) => {
    const { startDate, endDate } = tourInfo;
    const totalDays = getDaysGap(startDate, endDate);

    return `${startDate} - ${endDate} (${totalDays} ${
      totalDays > 1 ? t.days : t.day
    })`;
  };

  const getTotalEstimate = (tourInfo: DogTourInfo) => {
    const { dailyPrice, startDate, endDate } = tourInfo;

    if (!dailyPrice) return "Unable calculate estimate - missing daily price";

    const totalDays = getDaysGap(startDate, endDate);

    return `$${totalDays * dailyPrice} ($${dailyPrice}/${t.day})`;
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            {t.tourId}: {tourInfo.uid}
          </p>
          <CloseCircleOutlined
            onClick={closeViewDogTourInfo}
            style={{ fontSize: "20px", color: "red" }}
          />
        </div>

        <section
          style={{
            display: "flex",
            columnGap: "5px",
            flexDirection: "column",
            lineHeight: "10px",
          }}
        >
          <p>
            {getDogName(tourInfo)} - {getDogType(tourInfo)}{" "}
            {getDesexTag(tourInfo)}
          </p>
          <p>
            {t.tourPeriod}: {getTourPeriod(tourInfo)}
          </p>
          <p>
            {t.totalEstimatePrice}: {getTotalEstimate(tourInfo)}
          </p>
        </section>
      </Card>
    </div>
  );
}

export default timelineTourDetail;
