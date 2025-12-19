
import { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getWeatherIcon } from "../utils/weathericon";

const VISIBLE = 5;

function toYMD(date) {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function dayLabel(dateStr) {
 
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-GB", { weekday: "short" })
    .toUpperCase();
}

export default function WeeklyForecast({ weather, onSelectDay }) {
  const daily = weather?.daily;

  const days = useMemo(() => {
    if (!daily?.time) return [];

    // nomi possibili nei daily 
    const codes = daily.weathercode ?? daily.weather_code ?? [];
    const tMax = daily.temperature_2m_max ?? daily.temperature_max ?? [];
    const tMin = daily.temperature_2m_min ?? daily.temperature_min ?? [];

    const len = Math.min(daily.time.length, codes.length || daily.time.length);

    return Array.from({ length: len }, (_, i) => ({
      date: daily.time[i],
      label: dayLabel(daily.time[i]),
      code: Number(codes[i]),
      max: tMax[i],
      min: tMin[i],
    }));
  }, [daily]);

  // indice di oggi dentro daily.time → start da domani
  const todayIndex = useMemo(() => {
    if (!days.length) return 0;
    const todayStr = toYMD(new Date());
    const idx = days.findIndex((d) => d.date === todayStr);
    return idx >= 0 ? idx : 0;
  }, [days]);

  const minStart = Math.min(todayIndex + 1, Math.max(0, days.length - VISIBLE));
  const maxStart = Math.max(minStart, days.length - VISIBLE);

  const [startIndex, setStartIndex] = useState(minStart);
  const [selectedIndex, setSelectedIndex] = useState(todayIndex + 1);

  // quando cambia città/meteo → reset finestra a domani
  useEffect(() => {
    setStartIndex(minStart);
    setSelectedIndex(todayIndex + 1);
  }, [minStart, todayIndex]);

  const visibleDays = useMemo(() => {
    return days.slice(startIndex, startIndex + VISIBLE);
  }, [days, startIndex]);

  const canPrev = startIndex > minStart;
  const canNext = startIndex < maxStart;

  const handlePrev = () => setStartIndex((s) => Math.max(minStart, s - 1));
  const handleNext = () => setStartIndex((s) => Math.min(maxStart, s + 1));

  if (!weather || days.length === 0) return null;

  return (
    <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    width: "100%",

   
    borderTopLeftRadius: "var(--radius-lg)",
    borderTopRightRadius: "var(--radius-lg)",

   
    overflow: "hidden",
  }}
>

      <IconButton onClick={handlePrev} disabled={!canPrev} size="small">
        <ChevronLeftIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {visibleDays.map((d, i) => {
          const absoluteIndex = startIndex + i;
          const Icon = getWeatherIcon(d.code);
          const isSelected = absoluteIndex === selectedIndex;

          return (
            <Box
              key={d.date}
              onClick={() => {
                setSelectedIndex(absoluteIndex);
                onSelectDay?.(absoluteIndex, d);
              }}
              sx={{
                cursor: "pointer",
                flex: 1,
                minWidth: 0,
                borderRadius: 2,
                px: 1,
                py: 1,
                textAlign: "center",
                userSelect: "none",
                backgroundColor: isSelected ? "rgba(255,255,255,0.18)" : "transparent",
              }}
            >
              <Typography sx={{ fontSize: 12, opacity: 0.9, mb: 0.5 }}>
                {d.label}
              </Typography>

              <Icon sx={{ fontSize: 22, opacity: 0.95 }} />

              {(d.max != null || d.min != null) && (
                <Typography sx={{ fontSize: 12, opacity: 0.9, mt: 0.5 }}>
                  {d.max != null ? Math.round(Number(d.max)) : "--"}°
                  {" / "}
                  {d.min != null ? Math.round(Number(d.min)) : "--"}°
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      <IconButton onClick={handleNext} disabled={!canNext} size="small">
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
