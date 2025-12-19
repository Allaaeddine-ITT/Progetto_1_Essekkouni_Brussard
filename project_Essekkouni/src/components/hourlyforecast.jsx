
import { Box, Typography } from "@mui/material";
import { getWeatherIcon } from "../utils/weathericon";

export default function HourlyForecast({ weather, selectedDay }) {
  if (!weather?.hourly || !selectedDay) return null;

  const { time, temperature_2m, weathercode } = weather.hourly;

  // data selezionata: "YYYY-MM-DD"
  const dayStr = selectedDay.date;

  // filtra le ore di quel giorno
  const hours = time
    .map((t, i) => ({
      time: t,
      hour: t.slice(11, 16), // "HH:MM"
      temp: temperature_2m[i],
      code: weathercode[i],
    }))
    .filter((h) => h.time.startsWith(dayStr));

  if (hours.length === 0) return null;

  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.08)",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ opacity: 0.7, mb: 2, letterSpacing: 1 }}
      >
        HOURLY FORECAST
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,
        }}
      >
        {hours.map((h) => {
          const Icon = getWeatherIcon(h.code);

          return (
            <Box
              key={h.time}
              sx={{
                minWidth: 64,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                {h.hour}
              </Typography>

              <Icon sx={{ fontSize: 22, my: 0.5 }} />

              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {Math.round(h.temp)}°
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
