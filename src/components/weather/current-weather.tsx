import { Cloud, Droplets, Sunrise, Sunset, Thermometer, Wind } from "lucide-react";

import { useWeatherStore } from "@/stores/weather-store";
import { formatTime, getDayName, getWeatherDescription, getWindDirection } from "@/utils";
import { WeatherIcon } from "./weather-icon";

export const CurrentWeather = () => {

    const weather = useWeatherStore(state => state.weather);
    const selectedDay = useWeatherStore(state => state.selectedDay);

    if (!weather) return null;

    const { current, locationName } = weather;

    // determine the data to display based on whether a day is selected
    const displayData = selectedDay ? {
        temp: selectedDay.avgTemp,
        maxTemp: selectedDay.maxTemp,
        minTemp: selectedDay.minTemp,
        weatherCode: selectedDay.weatherCode,
        windSpeed: selectedDay.windSpeed,
        windDirection: selectedDay.windDirection,
        humidity: selectedDay.humidity,
        precipitation: selectedDay.precipitation,
        pressure: selectedDay.pressure,
        sunrise: selectedDay.sunrise,
        sunset: selectedDay.sunset,
        dayLabel: getDayName(selectedDay.date),
    }
    : {
        temp: current.temp,
        maxTemp: current.maxTemp,
        minTemp: current.minTemp,
        weatherCode: current.weatherCode,
        windSpeed: current.windSpeed,
        windDirection: current.windDirection,
        humidity: current.humidity,
        precipitation: current.precipitation,
        pressure: current.pressure,
        sunrise: current.sunrise,
        sunset: current.sunset,
        dayLabel: null,
    };

    // key triggers re-animation when selectedDay changes
    const contentKey = selectedDay?.date ?? 'current';

    return (
        <section aria-labelledby="current-weather-location" className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20">
            <h2 id="current-weather-location"  className="text-2xl font-bold text-center mb-2">{locationName}</h2>

            <div className="animate-fade-in" key={contentKey} aria-live="polite">
                {/* main weather display - current or selected day weather */}
                <div className="text-center mb-6">
                    {/* only display the day label if a day is selected */}
                    {displayData.dayLabel && (
                        <p className="text-primary-foreground/60 mb-2">{displayData.dayLabel}</p>
                    )}
                    <WeatherIcon code={displayData.weatherCode} className="w-20 h-20 mx-auto mb-2 opacity-90 drop-shadow-lg" />
                    <div className="relative inline-block mb-2">
                        <span className="text-7xl font-thin tracking-tighter drop-shadow-sm">{displayData.temp}°</span>
                        {selectedDay && (
                            <span className="absolute -right-12 top-3 text-sm font-medium opacity-50 uppercase tracking-widest rotate-90 origin-left">
                                Avg
                            </span>
                        )}
                    </div>
                    <p className="text-xl mb-1">{getWeatherDescription(displayData.weatherCode)}</p>
                    <p className="text-primary-foreground/70">H: {displayData.maxTemp}° L: {displayData.minTemp}°</p>
                </div>

                {/* wind and sunrise / sunset times */}
                <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-primary-foreground/20">
                    <div className="text-center">
                        <div className="bg-primary-foreground/10 p-2 rounded-full w-fit mx-auto mb-2">
                            <Wind className="w-5 h-5 text-sky-200" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider">Wind</p>
                        <p className="font-semibold text-sm">{getWindDirection(displayData.windDirection)} {displayData.windSpeed} <span className="text-xs font-normal opacity-70">km/h</span></p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-foreground/10 p-2 rounded-full w-fit mx-auto mb-2">
                            <Sunrise className="w-5 h-5 text-amber-200" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider">Sunrise</p>
                        <p className="font-semibold text-sm">{formatTime(displayData.sunrise)}</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-foreground/10 p-2 rounded-full w-fit mx-auto mb-2">
                            <Sunset className="w-5 h-5 text-orange-300" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider">Sunset</p>
                        <p className="font-semibold text-sm">{formatTime(displayData.sunset)}</p>
                    </div>
                </div>

                {/* humidity, precipitation and pressure */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
                    <div className="text-center">
                        <div className="bg-primary-foreground/10 p-2 rounded-full w-fit mx-auto mb-2">
                            <Droplets className="w-5 h-5 text-indigo-300" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider">Humidity</p>
                        <p className="font-semibold text-sm">{displayData.humidity}%</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-foreground/10 p-2 rounded-full w-fit mx-auto mb-2">
                            <Cloud className="w-5 h-5 text-blue-300" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider">Precipitation</p>
                        <p className="font-semibold text-sm">{displayData.precipitation} <span className="text-xs font-normal opacity-70">mm</span></p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-foreground/10 p-2 rounded-full w-fit mx-auto mb-2">
                            <Thermometer className="w-5 h-5 text-red-200" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-primary-foreground/60 mb-1 uppercase tracking-wider">Pressure</p>
                        <p className="font-semibold text-sm">{displayData.pressure} <span className="text-xs font-normal opacity-70">hPa</span></p>
                    </div>
                </div>
            </div>
        </section>
    );
}