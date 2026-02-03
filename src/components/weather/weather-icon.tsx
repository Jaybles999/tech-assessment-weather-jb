import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, Snowflake, CloudLightning, CloudFog, type LucideProps, } from 'lucide-react';

interface WeatherIconProps extends LucideProps {
    code: number;
}

// renders the weather icon based on the WMO code
export const WeatherIcon = ({ code, ...props }: WeatherIconProps) => {
    // clear
    if (code === 0) return <Sun {...props} />;

    // mainly clear, partly cloudy
    if (code <= 2) return <CloudSun {...props} />;

    // overcast
    if (code === 3) return <Cloud {...props} />;

    // fog
    if (code <= 48) return <CloudFog {...props} />;

    // drizzle
    if (code <= 57) return <CloudDrizzle {...props} />;

    // rain
    if (code <= 67) return <CloudRain {...props} />;

    // snow
    if (code <= 77) return <Snowflake {...props} />;

    // rain showers
    if (code <= 82) return <CloudRain {...props} />;

    // snow showers
    if (code <= 86) return <Snowflake {...props} />;

    // thunderstorm
    return <CloudLightning {...props} />;
}