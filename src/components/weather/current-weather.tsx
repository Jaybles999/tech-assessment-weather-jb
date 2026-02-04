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

    return (
        <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20">
            <h2 className="text-2xl font-bold text-center mb-2">{locationName}</h2>

            {/* main weather display - current or selected day weather */}
            <div className="text-center mb-6">
                {/* only display the day label if a day is selected */}
                {displayData.dayLabel && (
                    <p className="text-primary-foreground/60 mb-2">{displayData.dayLabel}</p>
                )}
                <WeatherIcon code={displayData.weatherCode} className="w-20 h-20 mx-auto mb-2 opacity-90" />
                <div className="relative inline-block mb-2">
                    <span className="text-7xl font-light">{displayData.temp}°C</span>
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
                    <Wind className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Wind</p>
                    <p className="font-semibold">{getWindDirection(displayData.windDirection)} {displayData.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                    <Sunrise className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Sunrise</p>
                    <p className="font-semibold">{formatTime(displayData.sunrise)}</p>
                </div>
                <div className="text-center">
                    <Sunset className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Sunset</p>
                    <p className="font-semibold">{formatTime(displayData.sunset)}</p>
                </div>
            </div>

            {/* humidity, precipitation and pressure */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
                <div className="text-center">
                    <Droplets className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Humidity</p>
                    <p className="font-semibold">{displayData.humidity}%</p>
                </div>
                <div className="text-center">
                    <Cloud className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Precipitation</p>
                    <p className="font-semibold">{displayData.precipitation} mm</p>
                </div>
                <div className="text-center">
                    <Thermometer className="w-5 h-5 mx-auto mb-1 opacity-70" />
                    <p className="text-sm text-primary-foreground/70">Pressure</p>
                    <p className="font-semibold">{displayData.pressure} hPa</p>
                </div>
            </div>
        </div>
    );
}