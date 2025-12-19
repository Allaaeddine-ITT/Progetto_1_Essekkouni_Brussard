import { Box, Typography } from "@mui/material";
import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import FoggyIcon from "@mui/icons-material/Foggy";

function codeToIcon(code) {
  const c = Number(code);
  if (c === 0) return <WbSunnyIcon fontSize="small" />;
  if ([1, 2, 3].includes(c)) return <CloudIcon fontSize="small" />;
  if ([45, 48].includes(c)) return <FoggyIcon fontSize="small" />;
  if ([61, 63, 65, 80, 81, 82].includes(c)) return <GrainIcon fontSize="small" />;
  if ([71, 73, 75, 85, 86].includes(c)) return <AcUnitIcon fontSize="small" />;
  if ([95, 96, 99].includes(c)) return <ThunderstormIcon fontSize="small" />;
  return <CloudIcon fontSize="small" />;
}

function fmtTime(iso) {
  if (!iso) return "--";
  const t = iso.split("T")[1];
  return t ? t.slice(0, 5) : "--";
}

function buildPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  d += ` T ${last.x} ${last.y}`;
  return d;
}

export default function HourlyForecastChart({ hours }) {
  if (!hours?.length) return null;

  const step = 2;
  const sampled = hours.filter((_, i) => i % step === 0).slice(0, 25);

  const temps = sampled
    .map((h) => (h.temp == null ? null : Number(h.temp)))
    .filter((n) => Number.isFinite(n));

  const tMin = temps.length ? Math.min(...temps) : 0;
  const tMax = temps.length ? Math.max(...temps) : 1;

  const W = 1200;
  const H = 120;

  const padX = 18;
  const padY = 14;

  const padTop = padY + 16;
  const padBottom = padY;

  const points = sampled.map((h, i) => {
    const x = padX + (i * (W - padX * 2)) / Math.max(sampled.length - 1, 1);
    const temp = Number.isFinite(Number(h.temp)) ? Number(h.temp) : tMin;
    const norm = (temp - tMin) / (tMax - tMin || 1);
    const y = padTop + (1 - norm) * (H - padTop - padBottom);
    return { x, y, temp };
  });

  const pathD = buildPath(points);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            opacity: 0.8,
          }}
        />
        <Typography variant="subtitle2" sx={{ opacity: 0.7, letterSpacing: 1 }}>
          24-HOUR FORECAST
        </Typography>
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto", mb: 1 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
          <path
            d={pathD}
            fill="none"
            stroke="rgba(196, 121, 0, 0.85)"
            strokeWidth="2"
            opacity="0.85"
          />

          {points.map((p, idx) => (
            <g key={idx}>
              <circle cx={p.x} cy={p.y} r="3" fill="rgba(196, 121, 0, 0.85)" />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="rgba(255,255,255,0.9)"
              >
                {Math.round(p.temp)}°
              </text>
            </g>
          ))}
        </svg>
      </Box>

      
      <Box sx={{ position: "relative", height: 78 }}>
        {sampled.map((h, idx) => {
          const xPct = (points[idx].x / W) * 100;

          return (
            <Box
              key={idx}
              sx={{
                position: "absolute",
                left: `${xPct}%`,
                top: 0,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                color: "rgba(255,255,255,0.9)",
                width: 90,
                maxWidth: "22vw",
                pointerEvents: "none",
              }}
            >
              <Box sx={{ opacity: 0.95 }}>{codeToIcon(h.weatherCode)}</Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.85 }}>
                <AirIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: 11 }}>
                  {h.wind != null ? `${Math.round(h.wind)}km/h` : "--"}
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 11, opacity: 0.85 }}>
                {fmtTime(h.time)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
