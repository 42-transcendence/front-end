export function MenuItem({
    children,
    className,
}: React.PropsWithChildren<{ className?: string }>) {
    return (
        <span
            className={`${className} w-full max-w-[240px] rounded p-3 text-center hover:bg-primary/50 `}
        >
            {children}
        </span>
    );
}
