import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { useFavorites } from "../hooks/usefavorites";
import { getWeatherData } from "../api_calls/openMeteo.api";
import { getWeatherIcon } from "../utils/weathericon";

function formatDateTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);

  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const day = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  return `${weekday} | ${day} ${time}`;
}

const COORDS_RE = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

function shortCity(label) {
  if (!label) return label;
  return String(label).split(",")[0].trim();
}

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("reverse geocode failed");
  const json = await res.json();

  const a = json?.address || {};
  const label =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.county ||
    json?.name ||
    json?.display_name ||
    null;

  return label;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();

  const [weatherById, setWeatherById] = useState({});
  const [loadingById, setLoadingById] = useState({});
  const [placeNameById, setPlaceNameById] = useState({});
  const [leavingIds, setLeavingIds] = useState(() => new Set());

  const empty = useMemo(() => favorites.length === 0, [favorites.length]);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      const nextWeatherById = {};

      for (const fav of favorites) {
        if (!fav?.id || fav?.lat == null || fav?.lon == null) continue;

        setLoadingById((p) => ({ ...p, [fav.id]: true }));

        try {
          const data = await getWeatherData(fav.lat, fav.lon);
          if (cancelled) return;

          const currentSrc = data?.current ?? data?.current_weather ?? null;
          const current = currentSrc
            ? {
                time: currentSrc.time ?? null,
                temp: currentSrc.temperature ?? currentSrc.temperature_2m ?? null,
                weatherCode: currentSrc.weather_code ?? currentSrc.weathercode ?? null,
              }
            : null;

          nextWeatherById[fav.id] = { current, _raw: data };

          const needsName =
            !fav?.name || (typeof fav.name === "string" && COORDS_RE.test(fav.name));

          if (needsName && !placeNameById[fav.id]) {
            try {
              const label = await reverseGeocode(fav.lat, fav.lon);
              if (!cancelled && label) {
                setPlaceNameById((p) => ({ ...p, [fav.id]: label }));
              }
            } catch {
              
            }
          }
        } catch {
          if (cancelled) return;
          nextWeatherById[fav.id] = { current: null };
        } finally {
          if (!cancelled) setLoadingById((p) => ({ ...p, [fav.id]: false }));
        }
      }

      if (!cancelled) setWeatherById(nextWeatherById);
    }

    loadAll();
    return () => {
      cancelled = true;
    };
    
  }, [favorites]);

  const openFav = (fav, displayName) => {
    const q = shortCity(displayName || fav?.name || "");
    navigate(`/?city=${encodeURIComponent(q)}`);
  };

  const handleRemove = (id) => {
    setLeavingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    window.setTimeout(() => {
      removeFavorite(id);
      setLeavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 180);
  };

  
  const pageBg = "#2f4463"; 
  const pillBg = "rgba(255,255,255,0.10)";
  const textMain = "#fff";

  return (
    
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        width: 1500,
        background:  "#2a3e5bff",
        transform: "translateX(-21px)",

        
        py: { xs: 2, sm: 3.5, md: 5},

        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
      }}
    >
      
      <Box
        sx={{
          mx: "auto",
          width: "100%",
          maxWidth: 1400, 
          mx: "auto",
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            
            width: "100%",
            display: "flex",
            alignItems: "center",
            
            justifyContent: "space-between",
            mb: { xs: 2, sm: 3 },
          }}
          
        >
          <Typography
            sx={{
              color: textMain,
              fontWeight: 900,
              fontSize: { xs: 38, sm: 54, md: 72 },
              lineHeight: 1,
              letterSpacing: -1.1,
            }}
          >
            Favorites
          </Typography>

          <IconButton
            onClick={() => navigate("/")}
            aria-label="Go home"
            sx={{
              width: { xs: 44, sm: 48 },
              height: { xs: 44, sm: 48 },
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
              transition: "transform 160ms ease, background 160ms ease",
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.92)" },
            }}
          >
            <HomeRoundedIcon sx={{ fontSize: 26 }} />
          </IconButton>
        </Box>

        {empty ? (
          <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: 18 }}>
            Nessun preferito ancora. Aggiungi una città con la ⭐ dalla pagina meteo.
          </Typography>
        ) : (
          <Stack spacing={{ xs: 1.3, sm: 1.6 }} sx={{ width: "100%" }}>
            {favorites.map((fav, index) => {
              const info = weatherById[fav.id]?.current ?? null;
              const isLoading = !!loadingById[fav.id];

              const Icon = getWeatherIcon(info?.weatherCode ?? null);

              const tempText =
                info?.temp == null ? (isLoading ? "…" : "—") : `${Math.round(info.temp)}°C`;

              const dateText = info?.time
                ? formatDateTime(info.time)
                : isLoading
                ? "Loading…"
                : "";

              const displayName =
                (fav?.name && !(typeof fav.name === "string" && COORDS_RE.test(fav.name))
                  ? fav.name
                  : null) ||
                placeNameById[fav.id] ||
                "Loading place…";

              const leaving = leavingIds.has(fav.id);

              return (
                <Box
                  key={fav.id ?? index}
                  role="button"
                  onClick={() => openFav(fav, displayName)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    background: pillBg,
                    borderRadius: 999,

                    mx: "auto",
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.9, sm: 2.2 },

                    cursor: "pointer",
                    userSelect: "none",

                    boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",

                    transform: leaving ? "scale(0.985)" : "scale(1)",
                    opacity: leaving ? 0 : 1,
                    transition: "transform 180ms ease, opacity 180ms ease",
                    animation: leaving ? "none" : "fav-enter 220ms ease-out",

                    "@keyframes fav-enter": {
                      "0%": { opacity: 0, transform: "translateY(10px) scale(0.985)" },
                      "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
                    },

                    "&:hover": {
                      transform: leaving ? "scale(0.985)" : "translateY(-1px)",
                      background: "rgba(255,255,255,0.14)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1.1, sm: 1.4 },
                      minWidth: 0,
                      flex: "1 1 auto",
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(fav.id);
                      }}
                      size="small"
                      sx={{
                        color: "#fff",
                        transition: "transform 150ms ease",
                        "&:active": { transform: "scale(0.9)" },
                      }}
                      aria-label="remove favorite"
                    >
                      <StarIcon />
                    </IconButton>

                    <LocationOnIcon sx={{ color: "#fff", opacity: 0.95 }} />

                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: { xs: 18, sm: 20, md: 22 },
                        letterSpacing: -0.25,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: { xs: "60vw", sm: "52vw", md: "44vw" },
                      }}
                    >
                      {displayName}
                    </Typography>

                    <ChevronRightIcon sx={{ color: "#fff", opacity: 0.8 }} />

                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.82)",
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "32vw",
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {dateText}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, sm: 1.2 },
                      pl: 2,
                      flex: "0 0 auto",
                    }}
                  >
                    <Icon sx={{ color: "#fff", fontSize: { xs: 30, sm: 34 } }} />
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: { xs: 20, sm: 24 },
                        letterSpacing: -0.6,
                      }}
                    >
                      {tempText}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
