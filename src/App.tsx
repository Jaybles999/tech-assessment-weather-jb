import { Loader2 } from "lucide-react";

import { MainLayout } from "./components/layout/main-layout";
import { getWeatherDescription } from "./utils";
import { useWeatherStore } from "./stores/weather-store";

export function App() {

    // get state from store
    const weather = useWeatherStore(state => state.weather);
    const isLoading = useWeatherStore(state => state.isLoading);
    const error = useWeatherStore(state => state.error);

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">

                {/* loading state */}
                {isLoading && (
                    <div className="flex items-center gap-2 mb-6">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-foreground/60" />
                        <span className="text-primary-foreground/60">Loading...</span>
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