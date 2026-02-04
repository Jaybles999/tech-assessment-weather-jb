import { RefreshCw } from 'lucide-react';

import { useWeatherStore } from '@/stores/weather-store';

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

// checks if the data is stale - older than 30 minutes
function isStale(timestamp: number): boolean {
    const STALE_THRESHOLD_MS = 30 * 60 * 1000;
    return Date.now() - timestamp > STALE_THRESHOLD_MS;
}

export function LastUpdated() {
    const lastUpdated = useWeatherStore((state) => state.lastUpdated);
    const weather = useWeatherStore((state) => state.weather);
    const refreshWeather = useWeatherStore((state) => state.refreshWeather);
    const isLoading = useWeatherStore((state) => state.isLoading);

    if (!weather || !lastUpdated) return null;

    const stale = isStale(lastUpdated);

    const handleRefresh = () => {
        if (!isLoading) {
            refreshWeather();
        }
    };

    return (
        <div className="text-center text-primary-foreground/60 text-sm py-4">
            <p className="flex items-center justify-center gap-2">
                <span className={stale ? 'text-primary-foreground' : ''}>
                    Updated {formatRelativeTime(lastUpdated)}
                </span>
                {/* if the data is stale, show the refresh button */}
                {stale && (
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground underline transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                )}
            </p>
        </div>
    );
}
