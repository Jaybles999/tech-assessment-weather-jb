import { useState } from "react";
import { Loader2 } from "lucide-react";

import { MainLayout } from "./components/layout/main-layout";
import type { WeatherData, GeoLocation } from "./types/weather";
import { getWeather, searchLocations } from "./services/weather-api";
import { getWeatherDescription } from "./utils";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export function App() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [locations, setLocations] = useState<GeoLocation[]>([]);
    const [showLocations, setShowLocations] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setShowLocations(true);

        try {
            const results = await searchLocations(query);
            setLocations(results);
            console.log('Search results:', results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationSelect = async (location: GeoLocation) => {
        setIsLoading(true);
        setError(null);
        setShowLocations(false);
        setLocations([]);

        try {
            const data = await getWeather(
                location.latitude,
                location.longitude,
                `${location.name}, ${location.country}`
            );
            setWeather(data);
            console.log('Weather data:', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather');
            console.error('Weather error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center space-y-6">
                {/* temporary search input */}
                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    handleSearch(searchValue);
                }}>
                    <div className="flex items-center gap-2">
                        <Input
                            name="city"
                            placeholder="Search for a city..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Button variant="outline" type="submit">Search</Button>
                    </div>
                </form>

                {/* location search results */}
                {showLocations && locations.length > 0 && (
                    <div className="">
                        <p className="">
                            Select a location:
                        </p>
                        {locations.map((location) => (
                            <button
                                key={location.id}
                                onClick={() => handleLocationSelect(location)}
                                className="w-full px-4 py-3 text-left hover:bg-black/10 transition-colors cursor-pointer border-b border-white/10 last:border-b-0"
                            >
                                <span className="font-medium">{location.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">{location.country}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* loading state */}
                {isLoading && (
                    <div className="flex items-center gap-2 mb-6">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading...</span>
                    </div>
                )}

                {/* error state */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-6 py-4 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* weather data */}
                {weather && !isLoading && (
                    <div className="bg-background p-8 rounded-xl shadow-sm border border-border text-center">
                        <h2 className="text-2xl font-semibold text-primary mb-2">Weather in {weather.locationName}</h2>
                        <p className="text-muted-foreground">
                            Current temperature: {weather.current.temp}°C<br />
                            High: {weather.current.maxTemp}°C<br />
                            Low: {weather.current.minTemp}°C<br />
                            Wind speed: {weather.current.windSpeed} km/h<br />
                            Wind direction: {weather.current.windDirection}°<br />
                            Humidity: {weather.current.humidity}%<br />
                            Precipitation: {weather.current.precipitation} mm<br />
                            Pressure: {weather.current.pressure} hPa<br />
                            Sunrise: {weather.current.sunrise}<br />
                            Sunset: {weather.current.sunset}<br />
                            Weather code: {getWeatherDescription(weather.current.weatherCode)}<br />
                            History: {weather.history.map((day) => (
                                <div key={day.date}>
                                    {day.date}: {day.maxTemp}°C - {day.minTemp}°C - {getWeatherDescription(day.weatherCode)}
                                </div>
                            ))}
                            Forecast: {weather.forecast.map((day) => (
                                <div key={day.date}>
                                    {day.date}: {day.maxTemp}°C - {day.minTemp}°C - {getWeatherDescription(day.weatherCode)}
                                </div>
                            ))}
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
  );
}

export default App;