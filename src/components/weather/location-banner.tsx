import { MapPin, X } from 'lucide-react';
import type { GeolocationState } from '@/hooks/use-geolocation';

interface LocationBannerProps {
    geolocation: GeolocationState;
}

export const LocationBanner = ({ geolocation }: LocationBannerProps) => { 
    const { showBanner, isLocating, requestLocation, dismissBanner } = geolocation;

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-10 left-0 right-0 z-50 p-4 animate-fade-in">
            <div className="max-w-2xl mx-auto">
                <div className="bg-primary-foreground/10 backdrop-blur-xl border border-primary-foreground/20 rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                        {/* icon */}
                        <div className="shrink-0 w-10 h-10 bg-blue-500/50 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-300" />
                        </div>

                        {/* text */}
                        <div className="flex-1 min-w-0">
                            <p className="text-primary-foreground font-medium text-sm">
                                Get local weather
                            </p>
                            <p className="text-primary-foreground/60 text-xs mt-0.5">
                                Use your location for instant weather updates
                            </p>
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={requestLocation}
                                disabled={isLocating}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-primary-foreground text-sm font-medium rounded-md transition-colors cursor-pointer"
                            >
                                {isLocating ? 'Locating...' : 'Use Location'}
                            </button>
                            <button
                                onClick={dismissBanner}
                                className="p-2 text-primary-foreground/40 hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg transition-colors cursor-pointer"
                                aria-label="Dismiss"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
