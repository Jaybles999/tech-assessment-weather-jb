import { Cloud, Droplets, Sunrise, Sunset, Thermometer } from "lucide-react";

import { useWeatherStore } from "@/stores/weather-store";
import { formatTime, getWeatherDescription, getWindDirection } from "@/utils";

export const CurrentWeather = () => {

    const weather = useWeatherStore(state => state.weather);

    if (!weather) return null;

    const { current, locationName } = weather;

    return (
        <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20">
            <h2 className="text-2xl font-bold mb-4">{locationName}</h2>

            <div className="flex items-start justify-between gap-6 mb-4">
                <div className="flex items-center gap-6">
                    {/* current, high and low temperatures */}
                    <div>
                        <div className="text-6xl font-light">{current.temp}°C</div>
                        <div className="text-sm text-primary-foreground/70 mt-1">
                            H: {current.maxTemp}° L: {current.minTemp}°
                        </div>
                    </div>
                    {/* description, wind speed and direction */}
                    <div className="space-y-1">
                        <p className="text-lg">{getWeatherDescription(current.weatherCode)}</p>
                        <p className="text-primary-foreground/70">Wind: {current.windSpeed} km/h</p>
                        <p className="text-primary-foreground/70">Wind direction: {getWindDirection(current.windDirection)}</p>
                    </div>
                </div>

                {/* sunrise and sunset times */}
                <div className="text-right space-y-2 text-sm">
                    <div className="flex items-center justify-end gap-2">
                        <Sunrise className="w-4 h-4 opacity-70" />
                        <span className="text-primary-foreground/70">Sunrise:</span>
                        <span className="font-medium">{formatTime(current.sunrise)}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Sunset className="w-4 h-4 opacity-70" />
                        <span className="text-primary-foreground/70">Sunset:</span>
                        <span className="font-medium">{formatTime(current.sunset)}</span>
                    </div>
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