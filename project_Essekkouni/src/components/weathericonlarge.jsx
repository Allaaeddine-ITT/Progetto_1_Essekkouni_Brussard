import { Box } from "@mui/material";
import { getWeatherIcon } from "../utils/weathericon";

export default function WeatherIconLarge({ weather }) {
  if (!weather?.current) return null;

  
  const code = weather.current.weatherCode;

  const Icon = getWeatherIcon(code);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: {xs:100,sm:260,md:400},
      }}
    >
      <Icon
        sx={{
          fontSize:{xs:140,sm:200,md:250},
          color: "#ffffffff",
        }}
      />
    </Box>
  );
}
