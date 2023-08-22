export function Panel({
    className,
    children,
}: {
    className: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`${className} gradient-border back-full relative rounded-[28px] bg-windowGlass/30 p-4 before:rounded-[28px] before:p-px`}
        >
            {children}
        </div>
    );
}
