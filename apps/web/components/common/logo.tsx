import { cn } from "@workspace/ui/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    width?: number | string;
    height?: number | string;
}

export const Logo = ({ className, width = 160, height = 40, ...props }: LogoProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 70"
            fill="none"
            width={width}
            height={height}
            className={cn("select-none", className)}
            {...props}
        >
            <defs>
                <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>

                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Icon: Abstract Sparkle / North Star */}
            <g transform="translate(15, 12) scale(0.9)">
                <path
                    d="M25 0 C25 20 20 25 0 25 C20 25 25 30 25 50 C25 30 30 25 50 25 C30 25 25 20 25 0 Z"
                    fill="url(#magicGradient)"
                    filter="url(#softGlow)"
                />
                <path
                    d="M55 5 C55 10 52 12 45 12 C52 12 55 14 55 20 C55 14 58 12 65 12 C58 12 55 10 55 5 Z"
                    fill="#3B82F6"
                    opacity="0.8"
                />
            </g>

            {/* Text: Uses currentColor/foreground for theme adaptability */}
            <text
                x="80"
                y="47"
                fontFamily="'Inter', system-ui, sans-serif"
                fontWeight="700"
                fontSize="36"
                className="fill-foreground text-foreground"
                letterSpacing="-1"
            >
                ResAnlys
            </text>

            {/* Tiny dot accent */}
            <circle cx="218" cy="18" r="2" fill="#EC4899" opacity="0.6" />
        </svg>
    );
};
