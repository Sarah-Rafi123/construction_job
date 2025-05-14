import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUserLocation } from "@/store/slices/userSlice";

const useGetCurrentLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(setCurrentUserLocation({ latitude, longitude }));
          },
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation();
  }, [dispatch]);
};

export default useGetCurrentLocation;
