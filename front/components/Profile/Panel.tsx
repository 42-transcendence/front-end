export function Panel({
    className,
    children,
}: {
    className: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={` ${className} flex flex-col items-center justify-start gap-2 rounded-xl bg-windowGlass/30 p-4`}
        >
            {children}
        </div>
    );
}
