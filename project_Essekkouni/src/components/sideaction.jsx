import { Box, Typography, IconButton } from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useEffect, useState } from "react";

export default function SideActions({
  onAddFavorite,
  onOpenFavorites,
  isFavorite = false,
  disabled = false,
}) {
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
        isFavorite={isFavorite}
        icon={
          isFavorite ? (
            <StarRoundedIcon sx={{ fontSize: 28, color: "#FFD54F" }} />
          ) : (
            <StarBorderRoundedIcon sx={{ fontSize: 28 }} />
          )
        }
        label="Add to favorites"
        onClick={onAddFavorite}
        disabled={disabled}
      />

      <ActionButton
        icon={<PlaceRoundedIcon sx={{ fontSize: 28 }} />}
        label="favorites"
        onClick={onOpenFavorites}
        disabled={false}
      />
    </Box>
  );
}

function ActionButton({ icon, label, onClick, disabled = false, isFavorite }) {
  
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    
    if (typeof isFavorite === "boolean") setAnimKey((k) => k + 1);
  }, [isFavorite]);

  const isStarButton = typeof isFavorite === "boolean";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <IconButton
        key={isStarButton ? animKey : "static"}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        sx={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: 999,
          background: "rgba(255,255,255,0.10)",
          color: "rgba(255,255,255,0.92)",
          opacity: disabled ? 0.5 : 1,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
          transition: "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",

          "&:hover": { background: "rgba(255,255,255,0.16)" },

          // pop 
          transform: isStarButton && isFavorite ? "scale(1.12)" : "scale(1)",
          boxShadow:
            isStarButton && isFavorite
              ? "0 0 18px rgba(255, 213, 79, 0.9)"
              : "inset 0 0 0 1px rgba(255,255,255,0.10)",

          // bounce 
          animation:
            isStarButton && isFavorite ? "fav-bounce 320ms ease-out" : "none",

          
          "&::after": isStarButton
            ? {
                content: '""',
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,213,79,.28), transparent 70%)",
                opacity: isFavorite ? 1 : 0,
                transition: "opacity 200ms ease",
                pointerEvents: "none",
              }
            : undefined,

          
          "@keyframes fav-bounce": {
            "0%": { transform: "scale(1)" },
            "40%": { transform: "scale(1.22)" },
            "70%": { transform: "scale(0.98)" },
            "100%": { transform: isStarButton && isFavorite ? "scale(1.12)" : "scale(1)" },
          },
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
