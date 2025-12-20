
import { useEffect, useMemo, useState } from "react";

const LS_KEY = "weather_favorites_v1";

function readLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
 
  const [favorites, setFavorites] = useState(() => readLS());

  
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const ids = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = (id) => ids.has(id);

  const toggleFavorite = (fav) => {
    if (!fav?.id) return;

    setFavorites((prev) => {
      const exists = prev.some((x) => x.id === fav.id);
      return exists ? prev.filter((x) => x.id !== fav.id) : [fav, ...prev];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return { favorites, toggleFavorite, removeFavorite, isFavorite };
}
