import { useEffect, useState } from "react";
import { getCityCoords } from "../api_calls/nominatim.api.js";
import { getWeatherData } from "../api_calls/openMeteo.api.js";

export default function useWeather(city) {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        let cityCoords;

        
        if (typeof city === "object" && city.lat && city.lon) {
          cityCoords = city;
        } 
        
        else {
          cityCoords = await getCityCoords(city);
        }

        setCoords(cityCoords);
        const weatherData = await getWeatherData(
          cityCoords.lat,
          cityCoords.lon
        );

        setWeather(weatherData);
      } catch (err) {
        console.error(err);
        setError("Errore nel recupero dei dati meteo");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city]);

  return {
    coords,
    weather,
    loading,
    error,
  };
}
