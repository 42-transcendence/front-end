export function Card({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string | undefined;
}) {
    return (
        <div
            className={`${className} gradient-border before:contents-[''] flex h-fit w-fit flex-col items-center justify-between gap-8 rounded-[28px] bg-windowGlass/30 p-24 backdrop-blur-[50px] before:absolute before:inset-0 before:rounded-[28px] before:p-px`}
        >
            {children}
        </div>
    );
}
