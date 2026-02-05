import { RefreshCw } from 'lucide-react';

import { useWeatherStore } from '@/stores/weather-store';
import { useRef, useEffect } from 'react';

// formats the timestamp as relative time
function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) return 'just now';
    // if the difference is less than 60 minutes, return the number of minutes ago
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    // if the difference is less than 24 hours, return the number of hours ago
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'over a day ago';
}

// thresholds for stale data and refresh button cooldown
const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
const REFRESH_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export function LastUpdated() {
    const lastUpdated = useWeatherStore((state) => state.lastUpdated);
    const weather = useWeatherStore((state) => state.weather);
    const refreshWeather = useWeatherStore((state) => state.refreshWeather);
    const isLoading = useWeatherStore((state) => state.isLoading);

    // prevents double refresh in strict mode
    const hasAutoRefreshed = useRef(false);

    // auto-refresh the weather data if it is stale
    useEffect(() => {
        if (hasAutoRefreshed.current) return;
        if (!lastUpdated || isLoading) return;

        // if the data is stale, refresh it
        if (Date.now() - lastUpdated > STALE_THRESHOLD_MS) {
            hasAutoRefreshed.current = true;
            refreshWeather();
        }
    }, [lastUpdated, isLoading, refreshWeather]);

    if (!weather || !lastUpdated) return null;

    // used to determine if the refresh button is disabled
    const isFresh = Date.now() - lastUpdated < REFRESH_COOLDOWN_MS;
    const isDisabled = isLoading || isFresh;

    const handleRefresh = () => {
        if (!isDisabled) {
            refreshWeather();
        }
    };

    return (
        <div className="flex items-center justify-center gap-2text-center text-primary-foreground/60 text-sm py-4">
            <span>Updated {formatRelativeTime(lastUpdated)}</span>
            <button
                onClick={handleRefresh}
                disabled={isDisabled}
                className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={isFresh ? 'Refresh available in a few minutes' : 'Refresh weather data'}
            >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
}
