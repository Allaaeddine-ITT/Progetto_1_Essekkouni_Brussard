import { Box, Typography, IconButton } from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useState } from "react";

export default function SideActions({ onAddFavorite, onOpenFavorites }) {
    const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 22,
        background: "rgba(255,255,255,0.08)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        py: 2,
      }}
    >
     <ActionButton
                icon={
                    isFavorite ? (
                    <StarRoundedIcon sx={{ fontSize: 28, color: "#FFD54F" }} />
                    ) : (
                    <StarBorderRoundedIcon sx={{ fontSize: 28 }} />
                    )
                }
                label="Add to favorites"
                onClick={() => {
                    setIsFavorite((v) => !v);   
                    onAddFavorite?.();          
                }}
            />


      <ActionButton
        icon={<PlaceRoundedIcon sx={{ fontSize: 28 }} />}
        label="favorites"
        onClick={onOpenFavorites}
      />
    </Box>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={onClick}
        sx={{
          width: 56,
          height: 56,
          borderRadius: 999,
          background: "rgba(255,255,255,0.10)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
          color: "rgba(255,255,255,0.92)",
          "&:hover": { background: "rgba(255,255,255,0.16)" },
        }}
      >
        {icon}
      </IconButton>

      <Typography sx={{ fontSize: 12, opacity: 0.85, textAlign: "center", width: 72 }}>
        {label}
      </Typography>
    </Box>
  );
}

