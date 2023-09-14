export function ContextMenuBase({
    children,
}: React.PropsWithChildren<{
    className?: string | undefined;
}>) {
    return (
        <div className="flex w-full flex-col items-center text-white">
            {children}
        </div>
    );
}
