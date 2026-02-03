import type { DailyForecast } from '@/types/weather';
import { DayCard } from '@/components/weather/day-card';

interface DayCardGridProps {
    title: string;
    days: DailyForecast[];
}

export const DayCardGrid = ({ title, days }: DayCardGridProps) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <div className="grid grid-cols-3 gap-3">
                {days.map((day) => (
                    <DayCard key={day.date} day={day} />
                ))}
            </div>
        </div>
    );
}