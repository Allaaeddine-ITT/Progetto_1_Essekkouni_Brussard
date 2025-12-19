


const UNSPLASH_ACCESS_KEY = "9n9ZOrFQHybKz3UF3ZW_h6WSZtzx-nMOg9XDfhETKZU";

/**
 
 * @param {string} cityName 
 * @returns {string|null} 
 */
export async function getCityImage(cityName) {
  if (!cityName) return null;

  
  const query = `${cityName} landmark`;

  const endpoint = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Errore nella richiesta immagini");

    const data = await response.json();

    
    const imageUrl = data.results?.[0]?.urls?.regular || null;

    
    return imageUrl || "/images/default.jpg";
  } catch (err) {
    console.error("Errore getCityImage:", err);
    return "/images/default.jpg"; 
  }
}