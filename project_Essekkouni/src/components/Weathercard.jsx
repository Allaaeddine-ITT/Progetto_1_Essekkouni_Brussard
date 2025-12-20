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

function cityToText(city) {
  if (!city) return "";
  if (typeof city === "string") return city;

  return (
    city.displayName ||
    city.name ||
    city.display_name ||
    city.label ||
    city.title ||
    ""
  );
}

function shortCity(label) {
  if (!label) return "City";
  return String(label).split(",")[0].trim() || "City";
}

export default function WeatherCard({ city, weather, loading = false }) {
  const [imageUrl, setImageUrl] = useState("/images/default.jpg");

  const cityText = cityToText(city);
  const cityLabel = shortCity(cityText);

  useEffect(() => {
    if (!cityText) return;

    let cancelled = false;

    (async () => {
      try {
        const url = await getCityImage(cityLabel);
        if (!cancelled) setImageUrl(url || "/images/default.jpg");
      } catch {
        if (!cancelled) setImageUrl("/images/default.jpg");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cityText, cityLabel]);

  if (!cityText) return null;

  const dateText = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const temp = weather?.current?.temp;
  const code = weather?.current?.weatherCode;

  const condition = Number.isFinite(code) ? codeToLabel(code) : "Weather";

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

        // ✅ responsive height
        height: { xs: 220, sm: 250, md: 280 },

        borderRadius: 3,
        overflow: "hidden",
        minWidth: 0,
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

          // ✅ responsive padding
          p: { xs: 2, sm: 2.5 },

          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minWidth: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <LocationOnIcon sx={{ fontSize: 18, opacity: 0.95 }} />
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              opacity: 0.95,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: 220, sm: 320, md: 420 },
            }}
          >
            {cityLabel}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 20, opacity: 0.9 }} />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: 26, sm: 32, md: 34 },
            fontWeight: 700,
            lineHeight: 1.05,
            mt: 0.5,
          }}
        >
          {condition}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 48, sm: 58, md: 64 },
            fontWeight: 800,
            lineHeight: 1,
            mt: { xs: 0.5, sm: 1 },
          }}
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
