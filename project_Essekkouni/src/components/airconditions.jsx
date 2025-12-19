import { Box, Typography } from "@mui/material";
import AirIcon from "@mui/icons-material/Air";
import UmbrellaIcon from "@mui/icons-material/Umbrella";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

export default function AirConditions({ day }) {
  if (!day) return null;

  const { max, windMax, precipProb, uvMax } = day;
    
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
        sx={{
          opacity: 0.7,
          mb: 2,
          letterSpacing: 1,
        }}
      >
        AIR CONDITIONS
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Condition
          icon={<WbSunnyIcon />}
          label="Real Feel"
          value={max != null ? `${max}°` : "--"}
        />

        <Condition
          icon={<AirIcon />}
          label="Wind"
          value={windMax != null ? `${Math.round(windMax)} km/h` : "--"}
        />

        <Condition
          icon={<UmbrellaIcon />}
          label="Chance of rain"
          value={precipProb != null ? `${Math.round(precipProb)}%` : "--"}
        />

        <Condition
          icon={<WbSunnyIcon />}
          label="UV Index"
          value={uvMax != null ? uvMax : "--"}
        />
      </Box>
    </Box>
  );
}

function Condition({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
