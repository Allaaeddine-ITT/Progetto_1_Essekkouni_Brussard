import { Box } from "@mui/material";
import { getWeatherIcon } from "../utils/weathericon";

export default function WeatherIconLarge({ weather }) {
  if (!weather) return null;

  const code =
    weather?.current_weather?.weathercode ??
    weather?.current?.weathercode ??
    weather?.current?.weather_code;

  const Icon = getWeatherIcon(Number(code));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 400,
      }}
    >
      <Icon
        sx={{
          fontSize: 250, 
          color: "#f5c542", 
        }}
      />
    </Box>
  );
}
