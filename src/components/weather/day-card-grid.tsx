import type { DailyForecast } from '@/types/weather';
import { DayCard } from '@/components/weather/day-card';
import { useWeatherStore } from '@/stores/weather-store';

interface DayCardGridProps {
    title: string;
    days: DailyForecast[];
}

export const DayCardGrid = ({ title, days }: DayCardGridProps) => {

    const selectedDay = useWeatherStore(state => state.selectedDay);
    const selectDay = useWeatherStore(state => state.selectDay);

    const handleDayClick = (day: DailyForecast) => {
        // select the day and deselect if same day is clicked
        if (selectedDay?.date === day.date) {
            selectDay(null);
        } else {
            selectDay(day);
        }
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <div className="grid grid-cols-3 gap-3">
                {days.map((day) => (
                    <DayCard
                        key={day.date}
                        day={day}
                        isSelected={selectedDay?.date === day.date}
                        onClick={() => handleDayClick(day)}
                    />
                ))}
            </div>
        </div>
    );
}