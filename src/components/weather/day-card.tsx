import type { DailyForecast } from '@/types/weather';
import { WeatherIcon } from './weather-icon';

interface DayCardProps {
    day: DailyForecast;
    isSelected?: boolean;
    onClick?: () => void;
}

export const DayCard = ({ day, isSelected, onClick }: DayCardProps) => {
    // get the weekday and convert to short format, e.g. Mon, Tue, etc.
    const weekday = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <button
            onClick={onClick}
            className={`w-full backdrop-blur-sm rounded-xl p-4 border text-center transition-all duration-200 cursor-pointer
                ${isSelected
                    ? 'bg-primary-foreground/20 border-primary-foreground ring-2 ring-primary-foreground shadow-lg scale-105'
                    : 'bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15 hover:scale-102'
                }`
            }
        >
            <p className="text-sm text-primary-foreground/70">{weekday}</p>
            <WeatherIcon code={day.weatherCode} className="w-8 h-8 mx-auto my-2 opacity-80" />
            <p className="text-xl font-semibold">{day.maxTemp}°</p>
            <p className="text-sm text-primary-foreground/60">{day.minTemp}°</p>
        </button>
    );
}