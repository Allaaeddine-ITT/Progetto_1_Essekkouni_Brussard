// src/pages/WeatherPage.jsx
import { useState } from "react";
import useWeather from "../hooks/useweather"; 
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/Weathercard";
import "../styles/Weather.css";
import WeatherIconLarge from "../components/weathericonlarge";


export default function WeatherPage() {
  const [city, setCity] = useState(null);
  const { weather, loading, error } = useWeather(city);

  return (
    <div className="weather-page">
      {/* TOP ROW: WeatherCard a sinistra + SearchBox a destra */}
      <div className="top-row">
        <div className="top-left">
          {city && (
            <WeatherCard
              city={city}
              weather={weather}
              loading={loading}
            />
          )}

          {/* Stato / error (sotto alla card) */}
          {!city && <p className="status">Search a city to start</p>}
          {loading && <p className="status">Loading...</p>}
          {error && <p className="status error">{error}</p>}
        </div>

        <div className="top-right">
          <SearchBox onSelectCity={setCity} />
        </div>
      </div>

      {/* RESTO MOCKUP (placeholder) */}
      <div className="content-grid">
        <div className="left-actions">SideActions</div>
        <div className="map">CityMap</div>
        <div className="center-icon">{weather && <WeatherIconLarge weather={weather} />}</div>
        <div className="right-forecast">WeeklyForecast</div>
        <div className="right-air">AirConditions</div>
        <div className="bottom-hourly">HourlyForecast</div>
      </div>
    </div>
  );
}
