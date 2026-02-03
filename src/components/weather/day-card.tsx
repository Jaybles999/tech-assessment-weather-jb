import type { DailyForecast } from '@/types/weather';
import { WeatherIcon } from './weather-icon';

interface DayCardProps {
    day: DailyForecast;
}

export const DayCard = ({ day }: DayCardProps) => {
    // get the weekday and convert to short format, e.g. Mon, Tue, etc.
    const weekday = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20 text-center">
            <p className="text-sm text-primary-foreground/70">{weekday}</p>
            <WeatherIcon code={day.weatherCode} className="w-8 h-8 mx-auto my-2 opacity-80" />
            <p className="text-xl font-semibold">{day.maxTemp}°</p>
            <p className="text-sm text-primary-foreground/60">{day.minTemp}°</p>
        </div>
    );
}