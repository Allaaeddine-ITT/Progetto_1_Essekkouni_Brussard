export default function WeatherHero({ cityName, current }) {
  if (!current) return null;

  return (
    <div className="weather-hero">
      <div className="weather-hero-header">
        <h2>{cityName}</h2>
      </div>

      <div className="weather-hero-main">
        <h1>{current.temperature}°C</h1>
        <p>Weather code: {current.weathercode}</p>
        <p>{new Date(current.time).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
