import { Calendar, Clock, Cloud, Droplets, Thermometer, Wind } from "lucide-react";

export const WelcomeScreen = () => {
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
                    Search for a city above to get current weather conditions,
                    3-day forecast, and 3-day history.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto border-t border-primary-foreground/10 pt-8">
                <article className="text-center">
                    <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Cloud className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold mb-1">Current Weather</h3>
                    <p className="text-sm text-primary-foreground/50">Real-time conditions</p>
                </article>
                <article className="text-center">
                    <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold mb-1">3-Day Forecast</h3>
                    <p className="text-sm text-primary-foreground/50">Plan ahead</p>
                </article>
                <article className="text-center">
                    <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold mb-1">3-Day History</h3>
                    <p className="text-sm text-primary-foreground/50">Look back</p>
                </article>
            </div>
        </section>
    );
}