import { MainLayout } from "./components/layout/main-layout";
import { useWeatherStore } from "./stores/weather-store";
import { CurrentWeather } from "./components/weather/current-weather";
import { DayCardGrid } from "./components/weather/day-card-grid";
import { WelcomeScreen } from "./components/empty-states/welcome-screen";
import { WeatherSkeleton } from "./components/empty-states/weather-skeleton";
import { LastUpdated } from "./components/weather/last-updated";
import { useGeolocation } from "./hooks/use-geolocation";
import { LocationBanner } from "./components/weather/location-banner";

export function App() {

    const geolocation = useGeolocation();

    // get state from store
    const weather = useWeatherStore(state => state.weather);
    const isLoading = useWeatherStore(state => state.isLoading);
    const error = useWeatherStore(state => state.error);

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary-foreground">

                {/* loading state */}
                {isLoading || geolocation.isLocating && <WeatherSkeleton />}

                {/* error state */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-6 py-4 mb-6">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* weather data */}
                {weather && !isLoading && !geolocation.isLocating && (
                    <div className="w-full max-w-4xl space-y-6">
                        <CurrentWeather />
                        <DayCardGrid />
                        <LastUpdated />
                    </div>
                )}

                {/* welcome screen */}
                {!weather && !isLoading && !error && !geolocation.isLocating && (
                    <WelcomeScreen />
                )}
            </div>

            <LocationBanner geolocation={geolocation} />

        </MainLayout>
  );
}

export default App;