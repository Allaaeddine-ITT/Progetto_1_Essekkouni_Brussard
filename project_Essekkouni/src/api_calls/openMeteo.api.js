const open_meteo_url = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(lat, lon) {
  if (lat == null || lon == null) {
    throw new Error("coordinate richieste");
  }

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: true,

    hourly: [
      "temperature_2m",
      "weathercode",
      "precipitation_probability",
      "windspeed_10m",
    ].join(","),

    daily: [
      "weathercode",
      "temperature_2m_max",
      "temperature_2m_min",
      "windspeed_10m_max",
      "precipitation_probability_max",
      "uv_index_max",
    ].join(","),

    timezone: "auto",
  });

  const response = await fetch(`${open_meteo_url}?${params}`);
  if (!response.ok) {
    throw new Error("meteo request failed");
  }

  const data = await response.json();

  return {
    current: data.current_weather,
    hourly: data.hourly,
    daily: data.daily,
  };
}
