import { useState } from 'react';
import { CloudSun } from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useWeatherStore } from '@/stores/weather-store';

export const Header = () => {

    const [searchValue, setSearchValue] = useState('');
    const searchCity = useWeatherStore(state => state.searchCity);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (searchValue.trim()) {
            searchCity(searchValue);
        }
    }

    return (
        <header className="bg-background shadow-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                    <CloudSun className="w-8 h-8" />
                    <h1 className="text-xl font-bold text-primary">JB Weather</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        type="text"
                        name="city"
                        placeholder="Search for a city.."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Button variant="outline" type="submit">Search</Button>
                </form>
            </div>
        </header>
    );
};