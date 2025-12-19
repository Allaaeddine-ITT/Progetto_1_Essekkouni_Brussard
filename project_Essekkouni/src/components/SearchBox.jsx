// src/components/SearchBox.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchCities } from "../api_calls/nominatim.api";

export default function SearchBox({ onSelectCity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const rootRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // Debounced search
  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);

    const t = setTimeout(async () => {
      try {
        const cities = await searchCities(q);
        setResults(cities);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [query]);

  const endAdornment = useMemo(() => {
    return loading ? (
      <CircularProgress size={18} />
    ) : (
      <SearchIcon fontSize="small" />
    );
  }, [loading]);

  return (
    <Box ref={rootRef} sx={{ width: 360, position: "relative" }}>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setOpen(true)}
        placeholder="Search location..."
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "999px", // pill shape
            height: 48,
            backgroundColor: "#fff",
            paddingRight: 1,
          },
          "& fieldset": {
            borderColor: "#e0e0e0",
          },
          "&:hover fieldset": {
            borderColor: "#bdbdbd",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#90caf9",
          },
        }}
        InputProps={{
          endAdornment: (
            <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
              {endAdornment}
            </Box>
          ),
        }}
      />

      {open && (loading || results.length > 0) && (
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            borderRadius: 3,
            overflow: "hidden",
            zIndex: 1200,
          }}
        >
          <List dense disablePadding>
            {results.map((city) => (
              <ListItemButton
                key={`${city.lat}-${city.lon}`}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                onClick={() => {
                  onSelectCity(city);
                  setQuery(city.displayName.split(",")[0]);
                  setOpen(false);
                  setResults([]);
                }}
              >
                <ListItemText
                  primary={city.displayName}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            ))}

            {!loading && results.length === 0 && (
              <ListItemText
                sx={{ px: 2, py: 1.5, opacity: 0.7 }}
                primary="No results"
              />
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
}
