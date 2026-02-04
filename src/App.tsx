import { Loader2 } from "lucide-react";

import { MainLayout } from "./components/layout/main-layout";
import { useWeatherStore } from "./stores/weather-store";
import { CurrentWeather } from "./components/weather/current-weather";
import { DayCardGrid } from "./components/weather/day-card-grid";
import { WelcomeScreen } from "./components/empty-states/welcome-screen";

export function App() {

    // get state from store
    const weather = useWeatherStore(state => state.weather);
    const isLoading = useWeatherStore(state => state.isLoading);
    const error = useWeatherStore(state => state.error);

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary-foreground">

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
                    <div className="w-full max-w-4xl space-y-6">
                        <CurrentWeather />
                        <DayCardGrid />
                    </div>
                )}

                {/* welcome screen */}
                {!weather && !isLoading && !error && (
                    <WelcomeScreen />
                )}
            </div>
        </MainLayout>
  );
}

export default App;