// TODO: 밖에서 쓰는 경우 없어 주석처리. 필요없을 시 추후 삭제필요
// export type ContextMenuItemProp = {
//     name: string;
//     className: string;
//     description?: string | undefined;
//     disabled?: boolean;
// };

export function ContextMenuItem({
    name,
    description,
    className,
    disabled,
    onClick,
}: {
    name: string;
    className: string;
    description?: string | undefined;
    disabled?: boolean | undefined;
    onClick?: React.MouseEventHandler | undefined;
}) {
    return (
        <div
            className={`relative ${className} flex h-fit w-full items-center rounded py-3 hover:bg-primary/30 active:bg-secondary/80 `}
            onClick={onClick}
        >
            <div className="relative flex w-full flex-col justify-center px-4 py-1">
                <div className={`select-none`}>{name}</div>
                {description !== undefined && (
                    <div className="select-none text-base text-purple-900">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}
