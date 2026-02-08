# Weatherly

A production-ready weather application built as a React technical assessment.

Weatherly displays current weather conditions alongside a 3-day history and 3-day forecast in a single interactive timeline, with an emphasis on clean architecture, accessibility, and user experience.

## Features

- Current weather conditions for a selected location
- 7-day interactive timeline (3-day history, today, 3-day forecast)
- Clickable day cards that update the main weather display
- Clear loading, empty, and error states
- Location search with recent searches persistence
- Optional browser geolocation with explicit user consent
- Responsive design for mobile and desktop
- Subtle animations and transitions for improved UX
- Local caching using browser storage for perceived performance

## Tech Stack

- React + TypeScript
- Vite
- Zustand (state management + persistence)
- Tailwind CSS
- shadcn/ui
- Open-Meteo API
- Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the app

```bash
npm run dev
```
The app will be available at http://localhost:5173.

### Running Tests

```bash
npm test
```
This runs the test suite using Vitest and React Testing Library.
All tests focus on user-facing behavior and critical user flows rather than implementation details.

## Design Decisions & Trade-offs

### State Management
Zustand was chosen for its minimal API and ability to manage global state without boilerplate. It also enables direct store access in tests and supports persistence via middleware.

### API Choice
The brief referenced the WeatherStack API; however, its free tier only provides current weather data and does not support historical or forecast information.

To fully implement the required 3-day history and 3-day forecast features without simulating data or introducing paid dependencies, Open-Meteo was selected instead. Open-Meteo provides free access to historical and forecast data and requires no API key.


### Caching Strategy
Caching is intentionally limited to localStorage using Zustand’s persistence middleware rather than implementing a full service worker or offline-first strategy.

This approach provides meaningful performance benefits and state restoration while keeping the implementation simple and maintainable, without introducing unnecessary complexity.

Cached weather data automatically refreshes after 30 minutes to prevent stale results, balancing performance with data freshness. There is also a manual refresh option protected by a short cooldown.

### Geolocation
Browser geolocation is opt-in and requires explicit user interaction before triggering the permission prompt. Location coordinates are used only for fetching weather data and are not stored in recent searches.

### Testing Strategy

Tests focus on critical user flows and observable behavior rather than exhaustive unit coverage. This prioritizes confidence in real user interactions while keeping the test suite fast and maintainable.

More granular unit tests could be added for utility functions or edge cases in a larger codebase.

## Accessibility

- Semantic HTML and ARIA attributes are used throughout the app
- Interactive elements are keyboard-accessible
- Loading states expose appropriate ARIA roles
- Focus and selection states are clearly communicated

## Future Improvements

- Offline support using a service worker to allow previously viewed weather data to be accessed without a network connection
- More granular cache invalidation strategies based on location, time of day, or data age
- Improved error handling for network failures
- Additional accessibility improvements, such as enhanced screen reader announcements and focus management during dynamic updates
- Basic client-side monitoring to better understand real-world usage and error conditions
