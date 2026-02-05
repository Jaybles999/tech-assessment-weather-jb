import { useWeatherStore } from "@/stores/weather-store";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GeoLocation } from "@/types/weather";

// geolocation types
export interface GeolocationState {
    showBanner: boolean;
    isLocating: boolean;
    requestLocation: () => void;
    dismissBanner: () => void;
}

const GEOLOCATION_TIMEOUT_MS = 8000;
const MAXIMUM_AGE_MS = 0;
const BANNER_DISMISSED_KEY = 'geolocation-banner-dismissed';

export function useGeolocation(): GeolocationState {
    const [showBanner, setShowBanner] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const hasChecked = useRef(false);

    const weather = useWeatherStore((state) => state.weather);
    const selectLocation = useWeatherStore((state) => state.selectLocation);

    // on mount, check if banner should be shown
    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        if (weather !== null) return;
        if (!navigator.geolocation) return;
        if (localStorage.getItem(BANNER_DISMISSED_KEY) === 'true') return;

        setShowBanner(true);
    }, [weather]);

    // hide the banner when the weather loads
    useEffect(() => {
        if (weather !== null) {
            setShowBanner(false);
        }
    }, [weather]);

    // request location from the user
    const requestLocation = useCallback(async () => {
        setIsLocating(true);
        setShowBanner(false);

        try {
            const position = await getCurrentPosition();

            const location: GeoLocation = {
                id: 0,
                name: 'Current Location',
                country: '',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            await selectLocation(location);
        } catch {
            localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
        } finally {
            setIsLocating(false);
        }
    }, [selectLocation]);

    const dismissBanner = useCallback(() => {
        setShowBanner(false);
        localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    }, []);

    return {
        showBanner,
        isLocating,
        requestLocation,
        dismissBanner,
    };
}

// function to get the current position
function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
                enableHighAccuracy: false, // high accuracy is not needed for city-level
                timeout: GEOLOCATION_TIMEOUT_MS,
                maximumAge: MAXIMUM_AGE_MS,
            }
        );
    });
}