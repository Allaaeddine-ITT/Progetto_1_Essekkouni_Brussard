// src/pages/WeatherPage.jsx
import { useEffect, useMemo, useState } from "react";
import useWeather from "../hooks/useweather";

import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/Weathercard";
import WeeklyForecast from "../components/weeklyforecast";
import AirConditions from "../components/airconditions";
import WeatherIconLarge from "../components/weathericonlarge";
import CityMap from "../components/citymap";

import { getHoursForDay } from "../utils/hourlyutils";
import HourlyForecastChart from "../components/hourlyforecastchart";

import "../styles/palette.css";
import "../styles/Weather.css";
import "leaflet/dist/leaflet.css";


export default function WeatherPage() {
  const [city, setCity] = useState(null);
  const { weather, loading, error ,coords} = useWeather(city);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    setSelectedDayIndex(0);
  }, [city]);

  const selectedDay = useMemo(() => {
    const days = weather?.daily;
    if (!Array.isArray(days) || days.length === 0) return null;

    const i = Math.min(Math.max(selectedDayIndex ?? 0, 0), days.length - 1);
    return { ...days[i], index: i };
  }, [weather?.daily, selectedDayIndex]);

  const hoursForSelectedDay = useMemo(() => {
    return getHoursForDay(weather?.hourly, selectedDay?.date);
  }, [weather?.hourly, selectedDay?.date]);

  const showPanelContent = !!city && !!weather && !loading && !error;

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
        <div className="map">
          <CityMap city={city} coords={coords}> </CityMap>
        </div>

        <div className="center-icon">
          {weather && <WeatherIconLarge weather={weather} day={selectedDay} />}
        </div>

        <div className="right-panel">
          {!city && <div className="panel-placeholder">Select a city</div>}
          {city && loading && <div className="panel-placeholder">Loading…</div>}
          {city && error && (
            <div className="panel-placeholder error">{error}</div>
          )}

          {showPanelContent && (
            <>
              <div className="weekly-strip">
                <WeeklyForecast
                  weather={weather}
                  selectedIndex={selectedDayIndex}
                  onSelectDay={setSelectedDayIndex}
                />
              </div>

              <div className="air-block">
                <AirConditions day={selectedDay} />
              </div>
            </>
          )}
        </div>

        <div className="bottom-24h">
          {!showPanelContent ? (
            <div className="chart-placeholder">24-hour forecast</div>
          ) : (
            <HourlyForecastChart hours={hoursForSelectedDay} />
          )}
        </div>
      </div>
    </div>
  );
}
