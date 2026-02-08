import { Calendar, Clock, Cloud, Droplets, Thermometer, Wind, Search, Navigation, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";

export const WelcomeScreen = () => {
    const { requestLocation, isLocating } = useGeolocation();

    return (
        <section aria-labelledby="welcome-heading" className="text-center space-y-6 mt-10 md:mt-0 animate-fade-in">
            <div className="flex items-center justify-center gap-3" aria-hidden="true">
                <Cloud className="w-10 h-10 animate-pulse" />
                <Thermometer className="w-10 h-10 animate-pulse delay-100" />
                <Droplets className="w-10 h-10 animate-pulse delay-200" />
                <Wind className="w-10 h-10 animate-pulse delay-300" />
            </div>

            <div className="space-y-2">
                <h2 id="welcome-heading"  className="text-3xl font-bold">Welcome to Weatherly</h2>
                <p className="text-primary-foreground/80 max-w-md mx-auto">
                    Search for a city or use your location to get current weather conditions,
                    3-day forecast, and 3-day history.
                </p>
                {/* search and use location buttons */}
                <div className="pt-8 flex flex-col gap-4 items-center w-full max-w-xs mx-auto">
                    <Button
                        onClick={() => document.getElementById('city-search-input')?.focus()}
                        className="w-full max-w-xs mx-auto gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 
                        text-primary-foreground font-semibold shadow-xs shadow-black/10 cursor-pointer"
                        size="lg"
                    >
                        <Search className="w-4 h-4" />
                        Search for a city
                    </Button>

                    <div className="flex items-center gap-3 w-full px-2">
                        <div className="h-px flex-1 bg-primary-foreground/20" />
                        <span className="text-primary-foreground/40 text-xs font-medium uppercase tracking-wider">or</span>
                        <div className="h-px flex-1 bg-primary-foreground/20" />
                    </div>

                    <Button
                        onClick={requestLocation}
                        disabled={isLocating}
                        variant="outline"
                        className="w-full gap-2 border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground 
                        hover:bg-primary-foreground/20 hover:text-primary-foreground hover:border-primary-foreground/30 
                        transition-all active:scale-95 backdrop-blur-sm cursor-pointer"
                        size="lg"
                    >
                        {isLocating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Navigation className="w-4 h-4" />
                        )}
                        Use my location
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto border-t border-primary-foreground/10 pt-8">
                <article className="text-center">
                    <div className="bg-primary-foreground/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Cloud className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold mb-1">Current Weather</h3>
                    <p className="text-sm text-primary-foreground/50">Real-time conditions</p>
                </article>
                <article className="text-center">
                    <div className="bg-primary-foreground/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold mb-1">3-Day Forecast</h3>
                    <p className="text-sm text-primary-foreground/50">Plan ahead</p>
                </article>
                <article className="text-center">
                    <div className="bg-primary-foreground/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold mb-1">3-Day History</h3>
                    <p className="text-sm text-primary-foreground/50">Look back</p>
                </article>
            </div>
        </section>
    );
}