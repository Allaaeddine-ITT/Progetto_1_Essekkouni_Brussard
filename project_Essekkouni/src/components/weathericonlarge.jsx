import { Box } from "@mui/material";
import { getWeatherIcon } from "../utils/weathericon";

export default function WeatherIconLarge({ weather }) {
  if (!weather?.current) return null;

  // ⚠️ prende il codice GIUSTO creato dal tuo hook
  const code = weather.current.weatherCode;

  const Icon = getWeatherIcon(code);

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
          color: "#ffffffff",
        }}
      />
    </Box>
  );
}
