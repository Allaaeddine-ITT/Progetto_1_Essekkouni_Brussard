import { useEffect, useState } from "react";
import { getCityCoords } from "../api/nominatim.api.js";
import { getWeatherData } from "../api/openMeteo.api.js";

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
    
        const cityCoords = await getCityCoords(city);
        setCoords(cityCoords);

        
        const weatherData = await getWeatherData(
          cityCoords.lat,
          cityCoords.lon
        );
        setWeather(weatherData);
      } catch (err) {
        setError("Errore nel recupero dei dati meteo");
        console.error(err);
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
