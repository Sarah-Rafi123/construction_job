import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCurrentLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
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
