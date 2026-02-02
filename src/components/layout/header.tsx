import { CloudSun } from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const Header = () => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const city = formData.get('city') as string;
        alert(city);
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
                        name="city"
                        placeholder="Search for a city.."
                    />
                    <Button variant="outline" type="submit">Search</Button>
                </form>
            </div>
        </header>
    );
};