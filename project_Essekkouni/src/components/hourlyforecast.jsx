import { Box, Typography } from "@mui/material";

/**
 * hours: array di ore già “normalizzate”
 * [
 *   { time: "13:00", temp: 18.2, iconUrl: "...", precipProb: 25 }
 * ]
 */
export default function HourlyForecast({ hours, title = "24-HOUR FORECAST" }) {
  if (!hours?.length) return null;

  return (
    <Box
      sx={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        p: 2,
        color: "var(--text-primary)",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ opacity: 0.7, letterSpacing: 1, mb: 1.5 }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 0.5,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {hours.map((h, idx) => (
          <HourItem key={`${h.time}-${idx}`} hour={h} />
        ))}
      </Box>
    </Box>
  );
}

function HourItem({ hour }) {
  const temp = hour?.temp != null ? `${Math.round(hour.temp)}°` : "--";
  const pop =
    hour?.precipProb != null ? `${Math.round(hour.precipProb)}%` : null;

  return (
    <Box
      sx={{
        flex: "0 0 auto",
        width: 78,
        borderRadius: 2,
        background: "rgba(255,255,255,0.06)",
        p: 1.2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.8,
      }}
    >
      <Typography sx={{ fontSize: 12, opacity: 0.75 }}>
        {hour?.time ?? "--"}
      </Typography>

      <Box
        sx={{
          width: 34,
          height: 34,
          display: "grid",
          placeItems: "center",
          borderRadius: 2,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        {hour?.iconUrl ? (
          <img
            src={hour.iconUrl}
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            style={{ display: "block" }}
          />
        ) : (
          <Box sx={{ width: 28, height: 28, opacity: 0.4 }} />
        )}
      </Box>

      <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{temp}</Typography>

      {pop && (
        <Typography sx={{ fontSize: 11, opacity: 0.65 }}>{pop}</Typography>
      )}
    </Box>
  );
}
