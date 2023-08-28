import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/ImageLibrary";

export function ProfileItemSelectable({
    className,
    selected,
    accountUUID,
    children,
    onClick,
}: {
    className?: string | undefined;
    accountUUID: string;
    selected: boolean;
    children?: React.ReactNode | undefined;
    onClick: React.MouseEventHandler;
}) {
    //TODO: get nick from accountUUID by fetch
    const nickName = "fallback";

    return (
        <li
            className={`group/profile relative flex h-fit w-full shrink-0 flex-col items-start ${className}`}
        >
            <label
                className="relative flex flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
                onClick={onClick}
                htmlFor={accountUUID}
            >
                <div className="relative flex w-full select-none items-center gap-4 rounded">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            accountUUID={accountUUID}
                            className="w-[32px]"
                            privileged={true}
                        />
                    </div>
                    <div className="w-full overflow-hidden">
                        <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 transition-all ease-linear group-hover/profile:-translate-x-[150%] group-hover/profile:overflow-visible group-hover/profile:delay-300 group-hover/profile:duration-[5000ms]">
                            {children ?? nickName}
                        </div>
                    </div>
                    <input
                        id={accountUUID}
                        className="peer hidden"
                        //TODO: change accountUUID to real nickName
                        name={accountUUID}
                        type="checkbox"
                        value="nick"
                    />
                    <div className="hidden h-6 w-6 shrink-0 rounded-full bg-secondary/80 outline outline-1 outline-secondary peer-checked:flex">
                        <Icon.Check className="h-6 w-6 p-1" />
                    </div>
                    <div className="h-6 w-6 shrink-0 rounded-full outline outline-1 outline-gray-300/60 peer-checked:hidden" />
                </div>
            </label>
        </li>
    );
}
