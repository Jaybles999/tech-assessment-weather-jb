import { useState } from 'react';
import { CloudSun, Loader2, MapPin } from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useWeatherStore } from '@/stores/weather-store';

export const Header = () => {

    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const searchCity = useWeatherStore(state => state.searchCity);

    // location state
    const locations = useWeatherStore(state => state.locations);
    const selectLocation = useWeatherStore(state => state.selectLocation);

    const showLocations = locations.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (searchValue.trim()) {
            setIsSearching(true);
            await searchCity(searchValue);
            setIsSearching(false);
        }
    }

    const handleLocationSelect = (location: typeof locations[0]) => {
        selectLocation(location);
        setSearchValue('');
    }

    return (
        <header className="bg-background/10 backdrop-blur-md sticky top-0 z-10 border-b border-background/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* logo and title */}
                <div className="flex items-center gap-2 text-primary-foreground">
                    <CloudSun className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-primary-foreground">Weatherly</h1>
                </div>

                {/* search form */}
                <div className="relative w-full sm:w-auto">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                            {isSearching ? (
                                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary-foreground/60" />
                            ) : (
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
                            )}
                            
                            <Input
                                type="text"
                                placeholder="Search city..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="pl-9 bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30"
                            disabled={isSearching || !searchValue.trim()}
                        >
                            Search
                        </Button>
                    </form>

                    {/* Location Dropdown */}
                    {showLocations && (
                        <div className="absolute top-full left-0 right-0 mt-5 bg-primary-foreground/10 backdrop-blur-md rounded-xl border border-primary-foreground/20 shadow-xl z-50 overflow-hidden">
                            <p className="px-4 py-2 text-sm text-primary-foreground/90 border-b border-primary-foreground/20">
                                Select a location:
                            </p>
                            {locations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => handleLocationSelect(loc)}
                                    className="w-full px-4 py-3 text-left text-primary-foreground hover:bg-primary-foreground/10 transition-colors border-b border-primary-foreground/10 last:border-b-0"
                                >
                                    <span className="font-medium">{loc.name}</span>
                                    <span className="text-primary-foreground/60 ml-2">{loc.country}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};