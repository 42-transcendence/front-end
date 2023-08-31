import { TargetedAccountUUIDAtom } from "@/atom/AccountAtom";
import { Avatar } from "@/components/Avatar";
import {
    ContextMenu_Friend,
    ContextMenu_Social,
    ContextMenu_MyProfile,
} from "@/components/ContextMenu";
import type { ProfileItemConfig as ProfileItemInternlConfig } from "@/components/ContextMenu";
import { fetcher, useSWR } from "@/hooks/fetcher";
import { AccountProfilePublicPayload } from "@/library/payload/profile-payloads";
import { Provider, createStore } from "jotai";

export function ProfileItem({
    className,
    accountUUID,
    selected,
    children,
    type,
    onClick,
}: React.PropsWithChildren<{
    className?: string | undefined;
    accountUUID: string;
    selected: boolean;
    onClick?: React.MouseEventHandler | undefined;
    type?: "social" | "friend" | "myprofile" | undefined;
}>) {
    const store = createStore();
    store.set(TargetedAccountUUIDAtom, accountUUID);

    const contextMenuType = () => {
        switch (type) {
            case "social":
                return <ContextMenu_Social />;
            case "friend":
                return <ContextMenu_Friend />;
            case "myprofile":
                return <ContextMenu_MyProfile />;
            default:
                return null;
        }
    };

    const { data } = useSWR(
        `/profile/public/${accountUUID}`,
        fetcher<AccountProfilePublicPayload>,
    );

    const nickName =
        children !== undefined
            ? children
            : `${data?.nickName}#${data?.nickTag}`;
    const statusMessage = data?.uuid; // TODO: 으음... 실제 statusbar

    return (
        <Provider store={store}>
            <div
                className={`relative flex h-fit w-full shrink-0 flex-col items-start ${className}`}
            >
                <div
                    className="group relative flex w-full flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
                    onClick={onClick}
                >
                    <div className="disable-select relative flex items-center gap-2 space-x-4 rounded">
                        <div className="relative flex items-center justify-center">
                            <Avatar
                                accountUUID={accountUUID}
                                className="w-[45px]"
                                privileged={true}
                            />
                        </div>
                        <div className="relative flex w-fit flex-col items-start gap-1">
                            <div className="relative w-fit whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                                {nickName}
                            </div>
                            <div className="text-normal text-xs text-gray-300">
                                {statusMessage}
                            </div>
                        </div>
                    </div>
                </div>
                {selected && contextMenuType()}
            </div>
        </Provider>
    );
}
