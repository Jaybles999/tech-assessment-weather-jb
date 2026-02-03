import { create } from 'zustand';

import type { DailyForecast, WeatherData, GeoLocation } from '@/types/weather';
import { getWeather, searchLocations } from '@/services/weather-api';

interface WeatherStore {
    // state
    weather: WeatherData | null;
    locations: GeoLocation[];
    selectedDay: DailyForecast | null;
    isLoading: boolean;
    error: string | null;

    // actions
    searchCity: (query: string) => Promise<void>;
    selectLocation: (location: GeoLocation) => Promise<void>;
    selectDay: (day: DailyForecast | null) => void;
    clearLocations: () => void;
    clearError: () => void;
    reset: () => void;
}

const inititialState = {
    weather: null,
    locations: [],
    selectedDay: null,
    isLoading: false,
    error: null,
}

export const useWeatherStore = create<WeatherStore>((set) => ({
    ...inititialState,

    // search for locations by city name
    // sets the locations state: an array of GeoLocation objects
    searchCity: async (query: string) => {
        if (!query.trim()) {
            set({ locations: [] });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const locations = await searchLocations(query);
            set({ locations, isLoading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to search locations.',
                isLoading: false,
            })
        }
    },

    // select a location from the locations state
    // fetches the weather data for the selected location
    // sets the weather state: a WeatherData object
    selectLocation: async (location: GeoLocation) => {
        set({ isLoading: true, error: null, locations: [] });

        try {
            const weather = await getWeather(
                location.latitude,
                location.longitude,
                `${location.name}, ${location.country}`
            );
            set({ weather, isLoading: false, selectedDay: null });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to fetch weather.',
                isLoading: false,
            });
        }

    },

    // select a day from the weather data
    // sets the selectedDay state: a DailyForecast object
    selectDay: (day: DailyForecast | null) => {
        set({ selectedDay: day });
    },

    clearLocations: () => {
        set({ locations: [] });
    },

    clearError: () => {
        set({ error: null });
    },

    reset: () => {
        set(inititialState);
    },
}));