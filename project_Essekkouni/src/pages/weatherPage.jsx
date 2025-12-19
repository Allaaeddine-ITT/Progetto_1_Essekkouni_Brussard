// src/pages/WeatherPage.jsx
import { useMemo, useState } from "react";
import useWeather from "../hooks/useweather";
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/Weathercard";
import WeeklyForecast from "../components/weeklyforecast";
import AirConditions from "../components/airconditions";
import WeatherIconLarge from "../components/weathericonlarge";
import "../styles/palette.css"
import "../styles/Weather.css";


export default function WeatherPage() {
  const [city, setCity] = useState(null);
  const { weather, loading, error } = useWeather(city);

  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const selectedDay = useMemo(() => {
    const d = weather?.daily;
    if (!d?.time?.length) return null;

    const i = selectedDayIndex ?? 0;

    const codes = d.weathercode ?? d.weather_code ?? [];
    const tMax = d.temperature_2m_max ?? d.temperature_max ?? [];
    const tMin = d.temperature_2m_min ?? d.temperature_min ?? [];

    const windMax = d.windspeed_10m_max ?? d.wind_speed_10m_max ?? [];
    const precipProb = d.precipitation_probability_max ?? [];
    const uvMax = d.uv_index_max ?? [];

    return {
      index: i,
      date: d.time[i],
      code: Number(codes[i]),
      max: tMax[i],
      min: tMin[i],
      windMax: windMax[i],
      precipProb: precipProb[i],
      uvMax: uvMax[i],
    };
  }, [weather, selectedDayIndex]);

  return (
    <div className="weather-page">
      <div className="top-row">
        <div className="top-left">
          {city && (
            <WeatherCard city={city} weather={weather} loading={loading} />
          )}

          {!city && <p className="status">Search a city to start</p>}
          {loading && <p className="status">Loading...</p>}
          {error && <p className="status error">{error}</p>}
        </div>

        <div className="top-right">
          <SearchBox onSelectCity={setCity} />
        </div>
      </div>

      <div className="content-grid">
        <div className="left-actions">SideActions</div>
        <div className="map">CityMap</div>

        <div className="center-icon">
          {weather && <WeatherIconLarge weather={weather} />}
        </div>

        
        <div className="right-panel">
          {!city && <div className="panel-placeholder">Select a city</div>}
          {city && loading && <div className="panel-placeholder">Loading…</div>}
          {city && error && (
            <div className="panel-placeholder error">{error}</div>
          )}

          {weather && !loading && !error && (
            <>
              <div className="weekly-strip">
                <WeeklyForecast
                  weather={weather}
                  onSelectDay={(index) => setSelectedDayIndex(index)}
                />
              </div>

              <div className="air-block">
                <AirConditions day={selectedDay} />
              </div>
            </>
          )}
        </div>

        
        <div className="bottom-24h">
          <div className="chart-placeholder">24-hour forecast chart</div>
        </div>
      </div>
    </div>
  );
}
