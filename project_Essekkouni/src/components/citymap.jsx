import { Box, Typography } from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Recenter({ lat, lon, zoom = 12 }) {
  const map = useMap();
  useEffect(() => {
    if (lat == null || lon == null) return;
    map.setView([lat, lon], zoom, { animate: true });
    setTimeout(() => map.invalidateSize(), 0); // ✅ evita render “strano” dopo resize
  }, [lat, lon, zoom, map]);
  return null;
}

export default function CityMap({ city, coords }) {
  const lat = coords?.lat ?? null;
  const lon = coords?.lon ?? null;

  const center = lat != null && lon != null ? [lat, lon] : [41.9028, 12.4964];

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* pill "Map" */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(6px)",
        }}
      >
        <MapOutlinedIcon sx={{ fontSize: 18, opacity: 0.95 }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, opacity: 0.95 }}>
          Map
        </Typography>
      </Box>

      {/* wrapper “rounded” per Leaflet */}
     <Box sx={{ width: "100%", height: "100%", borderRadius: 14, overflow: "hidden" }}>

        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          zoomControl={false}          // ✅ come mockup
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {lat != null && lon != null && (
            <>
              <Recenter lat={lat} lon={lon} zoom={12} />
              <Marker position={[lat, lon]}>
                <Popup>{typeof city === "string" ? city : "Selected city"}</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </Box>
    </Box>
  );
}
