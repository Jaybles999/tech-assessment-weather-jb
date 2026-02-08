import { useWeatherStore } from "@/stores/weather-store";
import { useCallback, useState } from "react";
import type { GeoLocation } from "@/types/weather";

// geolocation types
export interface GeolocationState {
    isLocating: boolean;
    requestLocation: () => void;
}

const GEOLOCATION_TIMEOUT_MS = 8000;
const MAXIMUM_AGE_MS = 0;

export function useGeolocation(): GeolocationState {
    const [isLocating, setIsLocating] = useState(false);

    const selectLocation = useWeatherStore((state) => state.selectLocation);

    // request location from the user
    const requestLocation = useCallback(async () => {
        setIsLocating(true);

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
            console.error('Failed to get current position');
        } finally {
            setIsLocating(false);
        }
    }, [selectLocation]);

    return {
        isLocating,
        requestLocation,
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