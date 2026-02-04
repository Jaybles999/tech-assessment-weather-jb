import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DailyForecast, WeatherData, GeoLocation } from '@/types/weather';
import { getWeather, searchLocations } from '@/services/weather-api';

interface WeatherStore {
    // persisted state
    weather: WeatherData | null;
    lastLocation: GeoLocation | null;
    lastUpdated: number | null;
    recentSearches: GeoLocation[];
    
    // non-persisted state
    selectedDay: DailyForecast | null;
    locations: GeoLocation[];
    isLoading: boolean;
    error: string | null;

    // actions
    searchCity: (query: string) => Promise<void>;
    selectLocation: (location: GeoLocation) => Promise<void>;
    refreshWeather: () => Promise<void>;
    selectDay: (day: DailyForecast | null) => void;
    clearLocations: () => void;
    clearError: () => void;
    reset: () => void;
}

// add a location to the recent searches array, remove duplicates and limit to 5
function addToRecentSearches(location: GeoLocation, existing: GeoLocation[]): GeoLocation[] {
    // remove duplicate by ID
    const filtered = existing.filter((loc) => loc.id !== location.id);
    // add to front and limit to 5
    return [location, ...filtered].slice(0, 5);
}

const inititialState = {
    // persisted
    weather: null,
    lastLocation: null,
    lastUpdated: null,
    recentSearches: [],
    // non-persisted
    locations: [],
    selectedDay: null,
    isLoading: false,
    error: null,
}

export const useWeatherStore = create<WeatherStore>()(
    persist(
        (set, get) => ({
            ...inititialState,

            // search for locations by city name
            // sets the locations state: an array of GeoLocation objects
            searchCity: async (query: string) => {
                if (!query.trim()) {
                    set({ locations: [] });
                    return;
                }

                try {
                    const locations = await searchLocations(query);
                    set({ locations });
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to search locations.',
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
                    // update the weather and persisted state
                    set({
                        weather,
                        isLoading: false,
                        selectedDay: null,
                        lastLocation: location,
                        lastUpdated: Date.now(),
                        recentSearches: addToRecentSearches(
                            location,
                            get().recentSearches
                        ),
                    });
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

            refreshWeather: async () => {
                const { lastLocation } = get();
                if (!lastLocation) return;

                set({ isLoading: true, error: null });

                try {
                    const weather = await getWeather(
                        lastLocation.latitude,
                        lastLocation.longitude,
                        `${lastLocation.name}, ${lastLocation.country}`
                    );

                    set({
                        weather,
                        isLoading: false,
                        lastUpdated: Date.now(),
                    });
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to refresh weather',
                        isLoading: false,
                    });
                }
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
        }),
        // persist the state to localStorage
        {
            name: 'weather-storage',

            // only persist the necessary state
            partialize: (state) => ({
                weather: state.weather,
                lastLocation: state.lastLocation,
                lastUpdated: state.lastUpdated,
                recentSearches: state.recentSearches,
            }),
        }
    )
);