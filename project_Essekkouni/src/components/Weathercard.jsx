// src/components/WeatherCard.jsx
import { useEffect, useMemo, useState } from "react";
import { Card, Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getCityImage } from "../api_calls/image.api";

function codeToLabel(code) {
  if (code === 0) return "Clear";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather";
}

export default function WeatherCard({ city, weather, loading = false }) {
  const [imageUrl, setImageUrl] = useState("/images/default.jpg");

  useEffect(() => {
    if (!city) return;

    let cancelled = false;

    (async () => {
      try {
        const url = await getCityImage(city.displayName);
        if (!cancelled) setImageUrl(url || "/images/default.jpg");
      } catch {
        if (!cancelled) setImageUrl("/images/default.jpg");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city]);

  if (!city) return null;

  const cityLabel = (city.displayName || "").split(",")[0] || "City";

  const dateText = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  // 🔑 NUOVO: lettura dal modello mappato
  const temp = weather?.current?.temp;
  const code = weather?.current?.weatherCode;

  const condition = Number.isFinite(code)
    ? codeToLabel(code)
    : "Weather";

  const tempText = loading
    ? "…"
    : Number.isFinite(temp)
    ? `${Math.round(temp)}°C`
    : "--°C";

  return (
    <Card
      className="hero-card"
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 860,
        height: 280,
        minWidth: 520,
        borderRadius: 3,
        overflow: "hidden",
      }}
      elevation={0}
    >
      {/* Background image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.18) 45%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          p: 2.5,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 18, opacity: 0.95 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, opacity: 0.95 }}>
            {cityLabel}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 20, opacity: 0.9 }} />
        </Box>

        <Typography
          sx={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05, mt: 0.5 }}
        >
          {condition}
        </Typography>

        <Typography
          sx={{ fontSize: 64, fontWeight: 800, lineHeight: 1, mt: 1 }}
        >
          {tempText}
        </Typography>

        <Typography sx={{ fontSize: 13, opacity: 0.9, mt: -0.5 }}>
          {dateText}
        </Typography>
      </Box>
    </Card>
  );
}
