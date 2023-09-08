import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import { Avatar } from "@components/Avatar";
import { useProtectedProfile, usePublicProfile } from "@hooks/useProfile";
import { Provider, createStore } from "jotai";
import type { Relationship } from "@components/ContextMenu";
import { ContextMenu } from "@components/ContextMenu";

export function ProfileItem({
    className,
    accountUUID,
    selected,
    type,
    onClick,
}: {
    className?: string | undefined;
    accountUUID: string;
    selected: boolean;
    onClick?: React.MouseEventHandler | undefined;
    type: Relationship;
}) {
    const profile = usePublicProfile(accountUUID);
    const protectedProfile = useProtectedProfile(accountUUID);

    const store = createStore();
    store.set(TargetedAccountUUIDAtom, accountUUID);

    const nick =
        profile !== undefined
            ? `${profile.nickName}#${profile.nickTag}`
            : "불러오는 중...";
    const statusMessage =
        protectedProfile?.statusMessage ?? "상태 메시지를 볼 수 없습니다.";

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
                                {nick}
                            </div>
                            <div className="text-normal text-xs text-gray-300">
                                {statusMessage}
                            </div>
                        </div>
                    </div>
                </div>
                {selected && <ContextMenu type={type} />}
            </div>
        </Provider>
    );
}
