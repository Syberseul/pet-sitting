import { getTours } from "@/APIs/dogTourApi";
import {
  DogTourInfo,
  getToursSuccess,
  isGetTourSuccess,
} from "@/Interface/dogTourInterface";
import { useEffect, useState } from "react";

function TourList() {
  const [ownerTours, setOwnerTours] = useState<DogTourInfo[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [isFetchingTours, setIsFetchingTours] = useState(false);

  useEffect(() => {
    fetchOwnerTours();
  }, [refreshFlag]);

  const fetchOwnerTours = async () => {
    setIsFetchingTours(true);

    const tours = await getTours();

    if (isGetTourSuccess(tours)) {
      const { data } = tours as getToursSuccess;
      setOwnerTours(data);
      console.log(data);
    }

    setIsFetchingTours(false);
  };

  const refreshTour = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return <div>TourList</div>;
}

export default TourList;
