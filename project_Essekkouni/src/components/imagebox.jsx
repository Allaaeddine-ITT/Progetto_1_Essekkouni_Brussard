import React, { useEffect, useState } from "react";
import { getCityImage } from "../api_calls/image.api";

export default function WeatherImageBox({ city }) {
  const [imageUrl, setImageUrl] = useState("/images/default.jpg");

  useEffect(() => {
    if (!city) return;

    async function fetchImage() {
      const url = await getCityImage(city.displayName);
      setImageUrl(url);
    }

    fetchImage();
  }, [city]);

  return (
    <div
      className="weather-image-box"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    />
  );
}
