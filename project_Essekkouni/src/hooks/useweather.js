import { useEffect, useState } from "react";
import { getCityCoords } from "../api_calls/nominatim.api.js";
import { getWeatherData } from "../api_calls/openMeteo.api.js";

function normalizeCoords(city, cityCoords) {
  if (!cityCoords) return null;

  const lat = Number(cityCoords.lat);
  const lon = Number(cityCoords.lon);

  return {
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    name:
      (typeof city === "string" && city) ||
      cityCoords.name ||
      cityCoords.display_name ||
      null,
    raw: cityCoords,
  };
}

function mapWeatherToUI(api, location) {
  if (!api) return null;

  const dailySrc = api.daily ?? {};
  const hourlySrc = api.hourly ?? {};

  const dailyTimes = Array.isArray(dailySrc.time) ? dailySrc.time : [];
  const hourlyTimes = Array.isArray(hourlySrc.time) ? hourlySrc.time : [];

  const daily = dailyTimes.map((date, i) => ({
    date,
    max: dailySrc.temperature_2m_max?.[i] ?? null,
    min: dailySrc.temperature_2m_min?.[i] ?? null,
    windMax: dailySrc.wind_speed_10m_max?.[i] ?? null,
    precipProb: dailySrc.precipitation_probability_max?.[i] ?? null,
    uvMax: dailySrc.uv_index_max?.[i] ?? null,
    weatherCode: dailySrc.weathercode?.[i] ?? null,
  }));

  const hourly = hourlyTimes.map((time, i) => ({
    time,
    temp: hourlySrc.temperature_2m?.[i] ?? null,
    precipProb: hourlySrc.precipitation_probability?.[i] ?? null,
    weatherCode:
      hourlySrc.weathercode?.[i] ?? hourlySrc.weather_code?.[i] ?? null,
    wind:
      hourlySrc.wind_speed_10m?.[i] ??
      hourlySrc.windspeed_10m?.[i] ??
      hourlySrc.wind_speed?.[i] ??
      null,
  }));

  const currentSrc = api.current ?? api.current_weather ?? null;
  const current = currentSrc
    ? {
        time: currentSrc.time ?? null,
        temp: currentSrc.temperature ?? currentSrc.temperature_2m ?? null,
        wind: currentSrc.windspeed ?? currentSrc.wind_speed_10m ?? null,
        weatherCode: currentSrc.weathercode ?? null,
      }
    : null;

  return {
    location,        
    current,
    daily,
    hourly,
    _raw: api,
  };
}

export default function useWeather(city) {
  const [coords, setCoords] = useState(null);  // { lat, lon, name, raw }
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    let cancelled = false;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        const rawCoords =
          typeof city === "object" && city.lat != null && city.lon != null
            ? city
            : await getCityCoords(city);

        if (cancelled) return;

        const location = normalizeCoords(city, rawCoords);
        setCoords(location);

        const weatherData =
          location?.lat != null && location?.lon != null
            ? await getWeatherData(location.lat, location.lon)
            : null;

        if (cancelled) return;

        setWeather(mapWeatherToUI(weatherData, location));
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Errore nel recupero dei dati meteo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [city]);

  return { coords, weather, loading, error };
}
