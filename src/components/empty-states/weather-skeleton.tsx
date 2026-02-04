import { Skeleton } from "@/components/ui/skeleton";

export const WeatherSkeleton = () => {
    return (
        <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            {/* current weather card skeleton */}
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20">
                <Skeleton className="h-8 w-72 mx-auto mb-6 bg-primary-foreground/20" />

                {/* main weather section */}
                <div className="text-center mb-6">
                    <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-foreground/20" />
                    <Skeleton className="h-[70px] w-44 mx-auto my-2 bg-primary-foreground/20" />
                    <Skeleton className="h-7 w-28 mx-auto mb-1 bg-primary-foreground/20" />
                    <Skeleton className="h-5 w-24 mx-auto bg-primary-foreground/20" />
                </div>

                {/* wind & sun times section */}
                <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-primary-foreground/20">
                    {['Wind', 'Sunrise', 'Sunset'].map((label) => (
                        <div key={label} className="text-center">
                            <Skeleton className="w-5 h-5 mx-auto mb-1 rounded bg-primary-foreground/20" />
                            <Skeleton className="h-4 w-10 mx-auto mb-1 bg-primary-foreground/20" />
                            <Skeleton className="h-5 w-16 mx-auto bg-primary-foreground/20" />
                        </div>
                    ))}
                </div>

                {/* humidity, precipitation and pressure section */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
                    {['Humidity', 'Precipitation', 'Pressure'].map((label) => (
                        <div key={label} className="text-center">
                            <Skeleton className="w-5 h-5 mx-auto mb-1 rounded bg-primary-foreground/20" />
                            <Skeleton className="h-4 w-14 mx-auto mb-1 bg-primary-foreground/20" />
                            <Skeleton className="h-5 w-12 mx-auto bg-primary-foreground/20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* day cards grid skeleton */}
            <div className="w-full">
                <div className="flex justify-center gap-3 overflow-x-auto py-2 px-1">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className="w-[100px] min-w-[100px] max-w-[100px] shrink-0 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20 bg-primary-foreground/10"
                        >
                            <Skeleton className="h-3 w-14 mx-auto mb-1 bg-primary-foreground/20" />
                            <Skeleton className="h-4 w-8 mx-auto mb-2 bg-primary-foreground/20" />
                            <Skeleton className="w-8 h-8 mx-auto my-2 rounded-full bg-primary-foreground/20" />
                            <Skeleton className="h-6 w-10 mx-auto mb-1 bg-primary-foreground/20" />
                            <Skeleton className="h-4 w-8 mx-auto bg-primary-foreground/20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}