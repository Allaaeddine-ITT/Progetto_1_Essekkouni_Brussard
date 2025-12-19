import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FoggyIcon from '@mui/icons-material/Foggy';
export function getWeatherIcon(code) {
  const c = Number(code);
  if (!Number.isFinite(c)) return CloudIcon;

  if (c === 0) return WbSunnyIcon;
  if ([1, 2].includes(c)) return CloudQueueIcon;
  if (c === 3) return CloudIcon;
  if ([45, 48].includes(c)) return FoggyIcon;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(c)) return WaterDropIcon;
  if ([71, 73, 75, 77].includes(c)) return AcUnitIcon;
  if ([95, 96, 99].includes(c)) return ThunderstormIcon;

  return CloudIcon;
}
