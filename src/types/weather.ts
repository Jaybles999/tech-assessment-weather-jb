// type for geocoding response - for search results
export interface GeoLocation {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

// type for historical and future days
export interface DailyForecast {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
}

// type for formatted weather data
export interface WeatherData {
    current: {
        temp: number;
        minTemp: number;
        maxTemp: number;
        weatherCode: number;
        windSpeed: number;
        windDirection: number;
        humidity: number;
        precipitation: number;
        pressure: number;
        sunrise: string;
        sunset: string;
    };
    forecast: DailyForecast[];
    history: DailyForecast[];
    locationName: string;
}

// type for API response from OpenMeteo
export interface OpenMeteoResponse {
    current_weather: {
        temperature: number;
        weathercode: number;
        windspeed: number;
        winddirection: number;
    };
    hourly: {
        time: string[];
        relativehumidity_2m: number[];
        precipitation: number[];
        pressure_msl: number[];
    }
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weathercode: number[];
        sunrise: string[];
        sunset: string[];
    };
}

// type for API response from OpenMeteo geocoding (city to latitude and longitude)
export interface GeoCodingResponse {
    results?: Array<{
        id: number;
        name: string;
        latitude: number;
        longitude: number;
        country: string;
    }>;
}