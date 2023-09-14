export function GlassWindow({
    className,
    children,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`gradient-border ${className} flex w-fit flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-['']`}
        >
            {children}
        </div>
    );
}
