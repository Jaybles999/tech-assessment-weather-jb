import { useCallback } from 'react';

import type { DailyForecast } from '@/types/weather';
import { DayCard } from '@/components/weather/day-card';
import { useWeatherStore } from '@/stores/weather-store';

function getRelativeLabel(date: string, todayDate: string): string {
    const day = new Date(date);
    const today = new Date(todayDate);
    const diffDays = Math.round((day.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
}

export const DayCardGrid = () => {

    const weather = useWeatherStore((state) => state.weather);
    const selectedDay = useWeatherStore((state) => state.selectedDay);
    const selectDay = useWeatherStore((state) => state.selectDay);

    // center scroll on mount on mobile only
    const scrollRef = useCallback((node: HTMLDivElement | null) => {
        if (node) {
            const maxScroll = node.scrollWidth - node.clientWidth;
            node.scrollLeft = maxScroll / 2;
        }
    }, []);

    if (!weather) return null;

    const { history, today, forecast } = weather;

    // build unified timeline of days
    const days = [...history, today, ...forecast];

    const handleDayClick = (day: DailyForecast, isToday: boolean) => {
        if (isToday) {
            // clicking today clears selection and shows the current weather
            selectDay(null);
        } else {
            // toggle selection for other days
            if (selectedDay?.date === day.date) {
                selectDay(null);
            } else {
                selectDay(day);
            }
        }
    };

    return (
        <div className="w-full">
            {/* <h3 className="text-lg font-semibold mb-4 text-center">7-Day Overview</h3> */}
            <div ref={scrollRef} className="flex gap-3 overflow-x-auto pt-2 pb-4 px-1">
                {days.map((day, i) => (
                    <DayCard
                        key={day.date}
                        day={day}
                        isSelected={selectedDay ? selectedDay.date === day.date : i === 3}
                        relativeLabel={getRelativeLabel(day.date, today.date)}
                        onClick={() => handleDayClick(day, i === 3)}
                    />
                ))}
            </div>
            {/* mobile only - show swipe hint */}
            <p className="text-center text-primary-foreground/40 text-xs mt-2 md:hidden">
                &larr; Swipe for more &rarr;
            </p>
        </div>
    );
}