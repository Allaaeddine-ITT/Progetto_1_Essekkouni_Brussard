
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useWeather from "../hooks/useweather";
import { useFavorites } from "../hooks/usefavorites";

import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/Weathercard";
import WeeklyForecast from "../components/weeklyforecast";
import AirConditions from "../components/airconditions";
import WeatherIconLarge from "../components/weathericonlarge";
import CityMap from "../components/citymap";
import SideActions from "../components/sideaction";
import HourlyForecastChart from "../components/hourlyforecastchart";

import { getHoursForDay } from "../utils/hourlyutils";

import "../styles/palette.css";
import "../styles/Weather.css";
import "leaflet/dist/leaflet.css";


function getCityLabel(input) {
  if (!input) return null;
  if (typeof input === "string") return input;

  return (
    input.name ||
    input.displayName || 
    input.display_name ||
    input.label ||
    input.title ||
    input.address?.city ||
    input.address?.town ||
    input.address?.village ||
    input.address?.municipality ||
    null
  );
}


function makeFavId(lat, lon) {
  if (lat == null || lon == null) return null;
  return `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;
}

function shortCity(label) {
  if (!label) return label;
  return String(label).split(",")[0].trim();
}

export default function WeatherPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const cityFromUrl = params.get("city") || null;
  const [city, setCity] = useState(cityFromUrl);

  useEffect(() => {
    if (cityFromUrl) setCity(cityFromUrl);
  }, [cityFromUrl]);

  const { weather, loading, error, coords } = useWeather(city);

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

  
  const windMaxForSelectedDay = useMemo(() => {
    const winds = (hoursForSelectedDay || [])
      .map((h) => Number(h.wind))
      .filter((n) => Number.isFinite(n));

    return winds.length ? Math.max(...winds) : null;
  }, [hoursForSelectedDay]);

  
  const dayForAir = useMemo(() => {
    if (!selectedDay) return null;

    
    return {
      ...selectedDay,
      windMax: selectedDay.windMax ?? windMaxForSelectedDay ?? null,
    };
  }, [selectedDay, windMaxForSelectedDay]);

  const showPanelContent = !!city && !!weather && !loading && !error;

  
  const { toggleFavorite, isFavorite } = useFavorites();

  
  const location = weather?.location ?? coords ?? null;

  
  const cityLabel =
    getCityLabel(city) ?? location?.name ?? location?.raw?.display_name ?? null;

  const fav = useMemo(() => {
    if (location?.lat == null || location?.lon == null) return null;

    const id = makeFavId(location.lat, location.lon);
    if (!id) return null;

    if (!cityLabel) return null;

    return {
      id,
      name: cityLabel,
      lat: location.lat,
      lon: location.lon,
    };
  }, [location?.lat, location?.lon, cityLabel]);

  const favOn = useMemo(() => {
    if (!fav?.id) return false;
    return isFavorite(fav.id);
  }, [fav?.id, isFavorite]);

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);

    const label = getCityLabel(selectedCity);
    if (label) setParams({ city: shortCity(label) });
  };

  const handleAddFavorite = () => {
    if (loading) return;

    if (!fav) {
      console.warn("Non posso aggiungere: mancano nome o coordinate (fav null).");
      return;
    }

    toggleFavorite(fav);
  };

  const handleOpenFavorites = () => {
    navigate("/favorites");
  };

  return (
    <div className="weather-page">
      <div className="top-row">
        <div className="top-left">
          {city && (
            <WeatherCard city={cityLabel ?? city} weather={weather} loading={loading} />
          )}

          {!city && <p className="status">Search a city to start</p>}
          {loading && <p className="status">Loading...</p>}
          {error && <p className="status error">{error}</p>}
        </div>

        <div className="top-right">
          <SearchBox onSelectCity={handleSelectCity} />
        </div>
      </div>

      <div className="content-grid">
        <div className="left-actions">
          <SideActions
            onAddFavorite={handleAddFavorite}
            onOpenFavorites={handleOpenFavorites}
            isFavorite={favOn}
            disabled={!fav || loading}
          />
        </div>

        <div className="map">
          <CityMap city={cityLabel ?? city} coords={coords} />
        </div>

        <div className="center-icon">
          {weather && <WeatherIconLarge weather={weather} day={selectedDay} />}
        </div>

        <div className="right-panel">
          {!city && <div className="panel-placeholder">Select a city</div>}
          {city && loading && <div className="panel-placeholder">Loading…</div>}
          {city && error && <div className="panel-placeholder error">{error}</div>}

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
                <AirConditions day={dayForAir} />
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
