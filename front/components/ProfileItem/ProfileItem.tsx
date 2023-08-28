import { Avatar } from "@/components/Avatar";
import {
    ContextMenu_Friend,
    ContextMenu_Social,
    ContextMenu_MyProfile,
} from "@/components/ContextMenu";
import type { ProfileItemConfig as ProfileItemInternlConfig } from "@/components/ContextMenu";

// TODO: 이거 꼭 이렇게 ProfileItemInternlConfig 거쳐서 두번 해야 하나요?

export type ProfileItemConfig = ProfileItemInternlConfig;

export function ProfileItem({
    className,
    info,
    selected,
    children,
    type,
    onClick,
}: React.PropsWithChildren<{
    className?: string | undefined;
    info: ProfileItemConfig;
    selected: boolean;
    onClick?: React.MouseEventHandler | undefined;
    type?: "social" | "friend" | "myprofile" | undefined;
}>) {
    const contextMenuType = () => {
        switch (type) {
            case "social":
                return <ContextMenu_Social info={info} />;
            case "friend":
                return <ContextMenu_Friend info={info} />;
            case "myprofile":
                return <ContextMenu_MyProfile info={info} />;
            default:
                return null;
        }
    };
    return (
        <div
            className={`relative flex h-fit w-full shrink-0 flex-col items-start ${className} `}
        >
            <div
                className="group relative flex w-full flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
                onClick={onClick}
            >
                <div className="disable-select relative flex items-center gap-2 space-x-4 rounded">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            accountUUID={info.uuid}
                            className="w-[45px]"
                            privileged={true}
                        />
                    </div>
                    <div className="relative flex w-fit flex-col items-start gap-1">
                        <div className="relative w-fit whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {children !== undefined ? children : info.name}
                        </div>
                        <div className="text-normal text-xs text-gray-300">
                            {info.statusMessage}
                        </div>
                    </div>
                </div>
            </div>
            {selected && contextMenuType()}
        </div>
    );
}
