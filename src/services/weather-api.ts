import type { WeatherData, OpenMeteoResponse, GeoCodingResponse, DailyForecast, GeoLocation } from '@/types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// search for locations by city name
// returns an array of GeoLocation objects
export async function searchLocations(query: string): Promise<GeoLocation[]> {
    if (!query.trim()) return [];

    const url = `${GEOCODING_API}?name=${query}&count=5&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data: GeoCodingResponse = await response.json();

    if (!data.results || data.results.length === 0) return [];

    return data.results.map((result) => ({
        id: result.id,
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
    }));
}

// fetch weather data for a given location based on latitude and longitude
// returns a WeatherData object
export async function getWeather(
    latitude: number,
    longitude: number,
    locationName: string,
): Promise<WeatherData> {

    const url = new URL(WEATHER_API);

    // set search parameters
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set('current_weather', 'true');
    url.searchParams.set('hourly', 'relativehumidity_2m,precipitation,pressure_msl');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('past_days', '3');
    url.searchParams.set('forecast_days', '4'); // today + 3

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Weather fetch failed: ${response.statusText}`);
    }

    const data: OpenMeteoResponse = await response.json();

    // return the data in WeatherData format
    return transformAPIResponse(data, locationName);
}

// transform the API response to the WeatherData format
function transformAPIResponse(
    response: OpenMeteoResponse,
    locationName: string,
): WeatherData {

    const { current_weather, hourly, daily } = response;

    const todayIndex = 3;

    const now = new Date();
    
    // get the index of current hour
    const currentHourIndex = hourly.time.findIndex(time => {
        const hourTime = new Date(time);
        return hourTime.getHours() === now.getHours() && hourTime.toDateString() === now.toDateString();
    }) || todayIndex * 24 + now.getHours(); // fallback to today's hour

    // build the history by slicing the daily data for the past 3 days
    const history: DailyForecast[] = daily.time.slice(0, todayIndex).map((date, i) => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        weatherCode: daily.weathercode[i],
    }));

    // build the forecast by slicing the daily data for the next 3 days
    const forecast: DailyForecast[] = daily.time.slice(todayIndex + 1, todayIndex + 4).map((date, i) => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max[todayIndex + i + 1]),
        minTemp: Math.round(daily.temperature_2m_min[todayIndex + i + 1]),
        weatherCode: daily.weathercode[todayIndex + i + 1],
    }));

    // return the data in WeatherData format
    return {
        current: {
            temp: Math.round(current_weather.temperature),
            minTemp: Math.round(daily.temperature_2m_min[todayIndex]),
            maxTemp: Math.round(daily.temperature_2m_max[todayIndex]),
            weatherCode: current_weather.weathercode,
            windSpeed: current_weather.windspeed,
            windDirection: current_weather.winddirection,
            humidity: Math.round(hourly.relativehumidity_2m[currentHourIndex]),
            precipitation: Math.round(hourly.precipitation[currentHourIndex]),
            pressure: Math.round(hourly.pressure_msl[currentHourIndex]),
            sunrise: daily.sunrise[todayIndex] ?? '',
            sunset: daily.sunset[todayIndex] ?? '',
        },
        forecast,
        history,
        locationName,
    };
}