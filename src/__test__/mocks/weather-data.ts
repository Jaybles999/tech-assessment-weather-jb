import { vi } from 'vitest';
import type { WeatherData, DailyForecast, GeoLocation } from '@/types/weather';

// mock DailyForecast object
function createMockDay(date: string, overrides: Partial<DailyForecast> = {}): DailyForecast {
    return {
        date,
        maxTemp: 25,
        minTemp: 18,
        avgTemp: 22,
        weatherCode: 1, // partly cloudy
        windSpeed: 15,
        windDirection: 180,
        humidity: 65,
        precipitation: 0,
        pressure: 1013,
        sunrise: `${date}T06:30`,
        sunset: `${date}T18:45`,
        ...overrides,
    };
}

// mock WeatherData object
export const mockWeatherData: WeatherData = {
    locationName: 'London, United Kingdom',
    current: {
        temp: 22,
        minTemp: 18,
        maxTemp: 25,
        weatherCode: 1,
        windSpeed: 15,
        windDirection: 180,
        humidity: 65,
        precipitation: 0,
        pressure: 1013,
        sunrise: '2026-02-06T06:30',
        sunset: '2026-02-06T18:45',
    },
    today: createMockDay('2026-02-06'),
    history: [
        createMockDay('2026-02-03'),
        createMockDay('2026-02-04'),
        createMockDay('2026-02-05'),
    ],
    forecast: [
        createMockDay('2026-02-07', { maxTemp: 20, minTemp: 14 }),
        createMockDay('2026-02-08', { maxTemp: 18, minTemp: 12 }),
        createMockDay('2026-02-09', { maxTemp: 23, minTemp: 16 }),
    ],
};

// mock location search results
export const mockLocations: GeoLocation[] = [
    { id: 2643743, name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
    { id: 2643744, name: 'London', country: 'Canada', latitude: 42.9834, longitude: -81.2497 },
];

// mock Open-Meteo API responses for geocoding search
export const mockGeocodingResponse = {
    results: mockLocations.map(loc => ({
        id: loc.id,
        name: loc.name,
        country: loc.country,
        latitude: loc.latitude,
        longitude: loc.longitude,
    })),
};

// mock fetch function that returns weather data for geocoding search and weather API
export function createMockFetch(overrides: { weatherData?: WeatherData; locations?: GeoLocation[] } = {}) {
    const weatherData = overrides.weatherData ?? mockWeatherData;

    return vi.fn().mockImplementation((url: string) => {
        // geocoding search
        if (url.includes('geocoding-api')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    results: (overrides.locations ?? mockLocations).map(loc => ({
                        id: loc.id,
                        name: loc.name,
                        country: loc.country,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    })),
                }),
            });
        }

        // weather API - return raw Open-Meteo format
        if (url.includes('api.open-meteo.com')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(createMockOpenMeteoResponse(weatherData)),
            });
        }

        return Promise.reject(new Error(`Unmocked fetch: ${url}`));
    });
}

// convert WeatherData to Open-Meteo response data format
function createMockOpenMeteoResponse(data: WeatherData) {
    const allDays = [...data.history, data.today, ...data.forecast];
    const hourlyLength = allDays.length * 24;

    return {
        current_weather: {
            temperature: data.current.temp,
            weathercode: data.current.weatherCode,
            windspeed: data.current.windSpeed,
            winddirection: data.current.windDirection,
        },
        hourly: {
            time: Array.from({ length: hourlyLength }, (_, i) => {
                const dayIndex = Math.floor(i / 24);
                const hour = i % 24;
                return `${allDays[dayIndex]?.date ?? '2026-02-06'}T${hour.toString().padStart(2, '0')}:00`;
            }),
            relativehumidity_2m: Array(hourlyLength).fill(data.current.humidity),
            precipitation: Array(hourlyLength).fill(data.current.precipitation),
            pressure_msl: Array(hourlyLength).fill(data.current.pressure),
        },
        daily: {
            time: allDays.map(d => d.date),
            temperature_2m_max: allDays.map(d => d.maxTemp),
            temperature_2m_min: allDays.map(d => d.minTemp),
            weathercode: allDays.map(d => d.weatherCode),
            sunrise: allDays.map(d => d.sunrise),
            sunset: allDays.map(d => d.sunset),
            windspeed_10m_max: allDays.map(d => d.windSpeed),
            winddirection_10m_dominant: allDays.map(d => d.windDirection),
            precipitation_sum: allDays.map(d => d.precipitation),
        },
    };
}
