export function SquareButton({
    children,
    icon,
    onClick,
}: React.PropsWithChildren<{
    icon?: React.ReactElement | undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}>) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="gradient-border relative flex h-12 w-48 flex-col justify-center rounded bg-windowGlass/30 px-4 py-[1px] backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded before:p-px before:content-[''] hover:bg-primary/30 active:bg-secondary/70"
        >
            <div className="flex items-center gap-2 py-2.5">
                {icon}
                <p className="font-sans text-sm font-medium text-neutral-200">
                    {children}
                </p>
            </div>
        </button>
    );
}
