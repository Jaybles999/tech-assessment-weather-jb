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
    url.searchParams.set('daily', [
        'temperature_2m_max',
        'temperature_2m_min',
        'weathercode',
        'sunrise',
        'sunset',
        'windspeed_10m_max',
        'winddirection_10m_dominant',
        'precipitation_sum'
    ].join(','));
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

// calculate the daily average from the hourly array
function getDailyAverage(hourlyData: number[], dayIndex: number): number {
    const startIndex = dayIndex * 24;
    const dayValues = hourlyData.slice(startIndex, startIndex + 24);

    // filter out null and invalid values
    const validValues = dayValues.filter((v) => v != null && !isNaN(v));
    if (validValues.length === 0) return 0;

    // calculate the average
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / validValues.length);
}

// build a DailyForecast object from the daily and hourly data
function buildDailyForecast(
    daily: OpenMeteoResponse['daily'],
    hourly: OpenMeteoResponse['hourly'],
    dayIndex: number
): DailyForecast {
    const maxTemp = Math.round(daily.temperature_2m_max[dayIndex]);
    const minTemp = Math.round(daily.temperature_2m_min[dayIndex]);

    return {
        date: daily.time[dayIndex],
        maxTemp,
        minTemp,
        avgTemp: Math.round((maxTemp + minTemp) / 2),
        weatherCode: daily.weathercode[dayIndex],
        windSpeed: Math.round(daily.windspeed_10m_max[dayIndex] ?? 0),
        windDirection: Math.round(daily.winddirection_10m_dominant[dayIndex] ?? 0),
        humidity: getDailyAverage(hourly.relativehumidity_2m, dayIndex),
        precipitation: Math.round((daily.precipitation_sum[dayIndex] ?? 0) * 10) / 10,
        pressure: getDailyAverage(hourly.pressure_msl, dayIndex),
        sunrise: daily.sunrise[dayIndex] ?? '',
        sunset: daily.sunset[dayIndex] ?? '',
    };
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

    // build the history by building DailyForecast objects for the past 3 days
    const history: DailyForecast[] = [0, 1, 2].map(i => buildDailyForecast(daily, hourly, i));

    // build today's DailyForecast object
    const today: DailyForecast = buildDailyForecast(daily, hourly, todayIndex);

    // build the forecast by building DailyForecast objects for the next 3 days
    const forecast: DailyForecast[] = [todayIndex + 1, todayIndex + 2, todayIndex + 3].map(i => buildDailyForecast(daily, hourly, i));

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
        today,
        forecast,
        history,
        locationName,
    };
}