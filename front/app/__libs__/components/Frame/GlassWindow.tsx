export function GlassWindow({
    className,
    children,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`gradient-border back-full ${
                className ?? "bg-windowGlass/30"
            } flex w-fit flex-col items-start rounded-[28px] p-px backdrop-blur-[50px] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-['']`}
        >
            {children}
        </div>
    );
}
