import { Cloud, Droplets, Sunrise, Sunset, Thermometer, Wind } from "lucide-react";

import { useWeatherStore } from "@/stores/weather-store";
import { formatTime, getWeatherDescription, getWindDirection } from "@/utils";
import { WeatherIcon } from "./weather-icon";

export const CurrentWeather = () => {

    const weather = useWeatherStore(state => state.weather);

    if (!weather) return null;

    const { current, locationName } = weather;

    return (
        <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20">
            <h2 className="text-2xl font-bold text-center mb-4">{locationName}</h2>

            {/* main weather display - current weather */}
            <div className="text-center mb-6">
                <WeatherIcon code={current.weatherCode} className="w-20 h-20 mx-auto mb-4 opacity-90" />
                <div className="text-7xl font-light mb-2">{current.temp}°C</div>
                <p className="text-xl mb-1">{getWeatherDescription(current.weatherCode)}</p>
                <p className="text-primary-foreground/70">H: {current.maxTemp}° L: {current.minTemp}°</p>
            </div>

            {/* wind and sunrise / sunset times */}
            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-primary-foreground/20">
                <div className="text-center">
                    <Wind className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Wind</p>
                    <p className="font-semibold">{getWindDirection(current.windDirection)} {current.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                    <Sunrise className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Sunrise</p>
                    <p className="font-semibold">{formatTime(current.sunrise)}</p>
                </div>
                <div className="text-center">
                    <Sunset className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Sunset</p>
                    <p className="font-semibold">{formatTime(current.sunset)}</p>
                </div>
            </div>

            {/* humidity, precipitation and pressure */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
                <div className="text-center">
                    <Droplets className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Humidity</p>
                    <p className="font-semibold">{current.humidity}%</p>
                </div>
                <div className="text-center">
                    <Cloud className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Precipitation</p>
                    <p className="font-semibold">{current.precipitation} mm</p>
                </div>
                <div className="text-center">
                    <Thermometer className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Pressure</p>
                    <p className="font-semibold">{current.pressure} hPa</p>
                </div>
            </div>
        </div>
    );
}