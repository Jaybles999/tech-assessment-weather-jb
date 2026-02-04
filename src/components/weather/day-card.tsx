import type { DailyForecast } from '@/types/weather';
import { WeatherIcon } from './weather-icon';

interface DayCardProps {
    day: DailyForecast;
    isSelected?: boolean;
    relativeLabel?: string;
    onClick?: () => void;
}

export const DayCard = ({ day, isSelected, relativeLabel, onClick }: DayCardProps) => {
    // get the weekday and convert to short format, e.g. Mon, Tue, etc.
    const weekday = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <button
            onClick={onClick}
            className={`w-[100px] min-w-[100px] max-w-[100px] shrink-0 backdrop-blur-sm rounded-xl p-4 border text-center cursor-pointer day-card-hover
                ${isSelected
                    ? 'bg-primary-foreground/25 border-primary-foreground ring-2 ring-primary-foreground shadow-lg day-card-selected'
                    : 'bg-primary-foreground/10 border-primary-foreground/20'}
                }`
            }
        >
            <p className="text-xs mb-1 text-primary-foreground/50">{relativeLabel}</p>
            <p className="text-sm text-primary-foreground/70">{weekday}</p>
            <WeatherIcon code={day.weatherCode} className="w-8 h-8 mx-auto my-2 opacity-80" />
            <p className="text-xl font-semibold">{day.maxTemp}°</p>
            <p className="text-sm text-primary-foreground/60">{day.minTemp}°</p>
        </button>
    );
}