import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";

export function getWeatherIcon(code) {
  if (code === 0) return WbSunnyIcon; // clear
  if ([1, 2].includes(code)) return CloudQueueIcon; // partly cloudy
  if (code === 3) return CloudIcon; // cloudy
  if ([45, 48].includes(code)) return CloudIcon; // fog
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return GrainIcon; // rain
  if ([71, 73, 75, 77].includes(code)) return AcUnitIcon; // snow
  if ([95, 96, 99].includes(code)) return ThunderstormIcon; // storm

  return CloudIcon; // fallback
}
