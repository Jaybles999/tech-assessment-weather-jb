
export const Footer = () => {
    return (
        <footer className="py-6 text-center text-primary-foreground/40 text-sm">
            <p>
                Weatherly | Weather data by&nbsp;
                <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/70 hover:text-primary-foreground"
                >
                    Open-Meteo.com
                </a>
            </p>
        </footer>
    )
}