export function MenuItem({
    children,
    onClick,
    className,
}: React.PropsWithChildren<{
    className?: string;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}>) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} w-full max-w-[240px] rounded p-3 text-center hover:bg-primary/50 `}
        >
            {children}
        </button>
    );
}
