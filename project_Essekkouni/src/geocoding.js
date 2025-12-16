async function GeoDecode(name){
    const apiUrl=`https://geocoding-api.open-meteo.com/v1/search?name=${name}Rome&count=10&language=en&format=json`
    const response= await fetch(apiUrl);
    const data=await response.json();
    const result=data.results
    console.log(result[0])
    
    
}
export default GeoDecode;