const url="https://nominatim.openstreetmap.org/search";
export async function getCityCoords (city) {
    if(!city){
        throw new Error("città non riconosciuta");

    }
    const params=new URLSearchParams({
        q:city,
        format:"json",
        limit:1
    });
    const response =await fetch(`${url}?${params}`);
    if(!response.ok){
        throw new Error("richiesta fallita");
        
    }
    const data= await response.json();
    if(!data.length){
        throw new Error("citta non trovata");
    }
    return{
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
        displayName: data[0].display_name
    };
}
export async function searchCities(query, limit = 5) {
  if (!query) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`
  );

  const data = await response.json();

  return data.map(item => ({
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon)
  }));
}
