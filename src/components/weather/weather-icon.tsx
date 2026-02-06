import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, Snowflake, CloudLightning, CloudFog, type LucideProps, } from 'lucide-react';

interface WeatherIconProps extends LucideProps {
    code: number;
}

// renders the weather icon based on the WMO code
export const WeatherIcon = ({ code, ...props }: WeatherIconProps) => {
    // clear
    if (code === 0) return <Sun aria-hidden {...props} />;

    // mainly clear, partly cloudy
    if (code <= 2) return <CloudSun aria-hidden {...props} />;

    // overcast
    if (code === 3) return <Cloud aria-hidden {...props} />;

    // fog
    if (code <= 48) return <CloudFog aria-hidden {...props} />;

    // drizzle
    if (code <= 57) return <CloudDrizzle aria-hidden {...props} />;

    // rain
    if (code <= 67) return <CloudRain aria-hidden {...props} />;

    // snow
    if (code <= 77) return <Snowflake aria-hidden {...props} />;

    // rain showers
    if (code <= 82) return <CloudRain aria-hidden {...props} />;

    // snow showers
    if (code <= 86) return <Snowflake aria-hidden {...props} />;

    // thunderstorm
    return <CloudLightning aria-hidden {...props} />;
}