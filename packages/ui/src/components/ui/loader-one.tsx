
const LoaderOne = () => {
    return (
        <div className="flex items-center justify-center gap-1">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="h-3 w-3 rounded-full bg-blue-500 animate-loader-one"
                    style={{
                        animationDelay: `${i * 0.2}s`
                    }}
                />
            ))}
        </div>
    )
}

export default LoaderOne