import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/App';
import { useWeatherStore } from '@/stores/weather-store';
import { createMockFetch, mockWeatherData, mockLocations } from '@/__test__/mocks/weather-data';

describe('Weather App', () => {
    beforeEach(() => {
        // reset store state before each test
        useWeatherStore.getState().reset();
    });

    // test 1: welcome / empty state
    // validate that the app shows the welcome screen when no city is selected
    it('displays welcome screen when no city is selected', () => {
        render(<App />);

        // welcome heading should be visible
        expect(screen.getByRole('heading', { name: /welcome to weatherly/i })).toBeInTheDocument();

        // feature cards should be present
        expect(screen.getByRole('heading', { name: /^current weather$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^3-day forecast$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^3-day history$/i })).toBeInTheDocument();
    });

    // test 2: search - weather display
    // validate the complete flow: search city - fetch - display weather data
    it('displays weather data after searching for a city', async () => {
        const user = userEvent.setup();
        const mockFetch = createMockFetch();
        vi.stubGlobal('fetch', mockFetch);

        render(<App />);

        // search for a city
        const searchInput = screen.getByPlaceholderText(/search city/i);
        await user.type(searchInput, 'London');

        const searchButton = screen.getByRole('button', { name: /^search$/i });
        await user.click(searchButton);

        // wait for location dropdown to appear
        await waitFor(() => {
            expect(screen.getByText(/select a location/i)).toBeInTheDocument();
        });

        // click the first location result (London, United Kingdom)
        const locationButtons = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('London') && btn.textContent?.includes('United Kingdom')
        );
        await user.click(locationButtons[0]);

        // wait for weather data to render
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: mockWeatherData.locationName })).toBeInTheDocument();
        });

        // verify weather display shows temperature
        expect(screen.getByText(`${mockWeatherData.current.temp}°`)).toBeInTheDocument();

        // verify day-card-grid section is present
        expect(screen.getByLabelText(/7-day weather overview/i)).toBeInTheDocument();
    });

    // test 3: loading state
    // validate that the loading skeleton appears during fetch and disappears after
    it('shows loading skeleton while fetching weather data', async () => {
        const user = userEvent.setup();

        // create a delayed fetch to observe loading state
        const mockFetch = vi.fn().mockImplementation((url: string) => {
            if (url.includes('geocoding-api')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        results: mockLocations.map(loc => ({
                            id: loc.id,
                            name: loc.name,
                            country: loc.country,
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                        })),
                    }),
                });
            }

            // delay weather response
            return new Promise(resolve =>
                setTimeout(() => resolve({
                    ok: true,
                    json: () => Promise.resolve(createMockOpenMeteoResponse()),
                }), 100)
            );
        });

        vi.stubGlobal('fetch', mockFetch);
        render(<App />);

        // search and select location
        const searchInput = screen.getByPlaceholderText(/search city/i);
        await user.type(searchInput, 'London');
        await user.click(screen.getByRole('button', { name: /^search$/i }));

        await waitFor(() => {
            expect(screen.getByText(/select a location/i)).toBeInTheDocument();
        });

        // click the first location result
        const locationButtons = screen.getAllByRole('button').filter(btn =>
            btn.textContent?.includes('London') && btn.textContent?.includes('United Kingdom')
        );
        await user.click(locationButtons[0]);

        // loading skeleton should appear with aria-busy
        expect(screen.getByRole('status', { name: /loading weather data/i })).toBeInTheDocument();

        // wait for loading to complete
        await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: /loading weather data/i }));

        // weather should be displayed
        expect(screen.getByRole('heading', { name: mockWeatherData.locationName })).toBeInTheDocument();
    });

    // test 4: day selection
    // validate that clicking a day card updates the main weather display
    it('updates weather display when selecting a different day', async () => {
        const user = userEvent.setup();
        vi.stubGlobal('fetch', createMockFetch());

        render(<App />);

        // set initial weather data via the store to skip search flow
        await useWeatherStore.getState().selectLocation(mockLocations[0]);

        // wait for weather to render
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: mockWeatherData.locationName })).toBeInTheDocument();
        });

        // find and click a forecast day card (Tomorrow) - use aria-label pattern
        const tomorrowCard = screen.getByRole('button', { name: /tomorrow/i });
        await user.click(tomorrowCard);

        // the selected day should show as pressed
        expect(tomorrowCard).toHaveAttribute('aria-pressed', 'true');

        // main display should show the day label when a non-today day is selected
        await waitFor(() => {
            // check that the selected day's temp range appears (maxTemp: 20, minTemp: 14)
            expect(screen.getByText(/H: 20°/)).toBeInTheDocument();
            expect(screen.getByText(/L: 14°/)).toBeInTheDocument();
        });
    });

    // test 5: persisted state
    // validate that the app initializes from localStorage if data exists
    it('initializes with persisted weather data from localStorage', async () => {
        // pre-populate localStorage with persisted Zustand state
        const persistedState = {
            state: {
                weather: mockWeatherData,
                lastLocation: mockLocations[0],
                lastUpdated: Date.now(),
                recentSearches: [mockLocations[0]],
            },
            version: 0,
        };

        localStorage.setItem('weather-storage', JSON.stringify(persistedState));

        // re-create the store to pick up persisted state and trigger hydration
        useWeatherStore.persist.rehydrate();

        render(<App />);

        // weather should be displayed immediately without fetching
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: mockWeatherData.locationName })).toBeInTheDocument();
        });

        // day-card-grid should be visible
        expect(screen.getByLabelText(/7-day weather overview/i)).toBeInTheDocument();
    });
});

// helper to create mock Open-Meteo data for loading test
function createMockOpenMeteoResponse() {
    const allDays = [...mockWeatherData.history, mockWeatherData.today, ...mockWeatherData.forecast];
    const hourlyLength = allDays.length * 24;

    return {
        current_weather: {
            temperature: mockWeatherData.current.temp,
            weathercode: mockWeatherData.current.weatherCode,
            windspeed: mockWeatherData.current.windSpeed,
            winddirection: mockWeatherData.current.windDirection,
        },
        hourly: {
            time: Array.from({ length: hourlyLength }, (_, i) => {
                const dayIndex = Math.floor(i / 24);
                const hour = i % 24;
                return `${allDays[dayIndex]?.date ?? '2026-02-06'}T${hour.toString().padStart(2, '0')}:00`;
            }),
            relativehumidity_2m: Array(hourlyLength).fill(mockWeatherData.current.humidity),
            precipitation: Array(hourlyLength).fill(mockWeatherData.current.precipitation),
            pressure_msl: Array(hourlyLength).fill(mockWeatherData.current.pressure),
        },
        daily: {
            time: allDays.map(d => d.date),
            temperature_2m_max: allDays.map(d => d.maxTemp),
            temperature_2m_min: allDays.map(d => d.minTemp),
            weathercode: allDays.map(d => d.weatherCode),
            sunrise: allDays.map(d => d.sunrise),
            sunset: allDays.map(d => d.sunset),
            windspeed_10m_max: allDays.map(d => d.windSpeed),
            winddirection_10m_dominant: allDays.map(d => d.windDirection),
            precipitation_sum: allDays.map(d => d.precipitation),
        },
    };
}