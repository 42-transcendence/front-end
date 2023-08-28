// TODO: remove unused export
// export { ContextMenuItem } from "./ContextMenuItem";

export function ContextMenuBase({
    className,
    children,
}: React.PropsWithChildren<{
    className?: string | undefined;
}>) {
    return (
        <div className={`${className} flex flex-col items-center text-white`}>
            {children}
        </div>
    );
}
