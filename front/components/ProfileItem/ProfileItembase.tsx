import { Avatar } from "../Avatar";

export function ProfileItemBase({
    className,
    uuid,
}: {
    className?: string | undefined;
    uuid?: string | undefined;
}) {
    //TODO: get name, status from uuid
    const name = "hdoo";
    const tag = "#1234";

    return (
        <div
            className={`relative flex h-fit w-full shrink-0 flex-col items-start rounded bg-windowGlass/30 p-1 ${className} `}
        >
            <div className="group relative flex w-full flex-row items-center self-stretch ">
                <div className="disable-select relative flex items-center gap-2 space-x-4 ">
                    <div className="relative flex items-center justify-center">
                        <Avatar className="w-6 p-2" accountUUID={uuid} />
                    </div>
                    <div className="relative flex w-fit flex-row items-center justify-center gap-3">
                        <p className="relative w-fit whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {name}
                        </p>
                        <p className="relative w-fit whitespace-nowrap font-sans text-xs font-normal leading-none tracking-normal text-gray-300/60">
                            {tag}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
