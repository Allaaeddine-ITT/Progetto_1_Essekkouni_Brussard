import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import WeatherPage from "./pages/weatherPage";
import FavoritesPage from "./pages/favoritespage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/favorites" element={<FavoritesPage />} />

        
        <Route path="*" element={<WeatherPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
