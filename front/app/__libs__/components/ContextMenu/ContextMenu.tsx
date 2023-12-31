import { ContextMenuBase } from "./ContextMenuBase";
import { useAtomValue } from "jotai";
import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import {
    useProfileRecord,
    useProtectedProfile,
    usePublicProfile,
} from "@hooks/useProfile";
import { useEffect, useRef } from "react";
import { useChatMember } from "@hooks/useChatRoom";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { useContextMenuActions } from "./useContextMenuActions";
import type { ProfileMenu, Scope } from "./useContextMenus";
import { useContextMenus } from "./useContextMenus";
import { ChangeVisibilityMenu } from "./ChangeVisibilityMenu";
import { ChangeStatusMessageMenu } from "./ChangeStatusMessageMenu";

function ContextMenuItem({
    menuInfo,
    action,
}: {
    menuInfo: ProfileMenu;
    action: (() => void) | undefined;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const disabled = action === undefined;

    useEffect(() => {
        const elem = ref.current;

        if (elem === null) {
            throw new Error();
        }

        if (action !== undefined) {
            elem.addEventListener("click", action);
        }

        return () => {
            if (action !== undefined) {
                elem.removeEventListener("click", action);
            }
        };
    }, [action]);

    return (
        <>
            <button
                type="button"
                ref={ref}
                disabled={disabled}
                className={`relative flex h-fit w-full items-center rounded py-3 ${
                    menuInfo.isImportant
                        ? menuInfo.className
                        : "hover:bg-primary/30"
                } ${!disabled && "active:bg-secondary/80"}`}
            >
                <div className="relative flex w-full flex-col justify-center px-4 py-1">
                    <div className="flex select-none justify-start">
                        {menuInfo.name}
                    </div>
                    {menuInfo.description !== undefined && (
                        <div className="select-none text-base text-purple-900">
                            {menuInfo.description}
                        </div>
                    )}
                </div>
            </button>
        </>
    );
}

export function ContextMenu({ type }: { type: Scope }) {
    const targetAccountUUID = useAtomValue(TargetedAccountUUIDAtom);
    const protectedProfile = useProtectedProfile(targetAccountUUID);
    const publicProfile = usePublicProfile(targetAccountUUID);
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const currentAccountUUID = useCurrentAccountUUID();

    const currentUser = useChatMember(currentChatRoomUUID, currentAccountUUID);
    const roleLevel = Number(currentUser?.role ?? 0);

    const record = useProfileRecord(targetAccountUUID);

    const menus = useContextMenus(targetAccountUUID, currentChatRoomUUID);
    const actions = useContextMenuActions(
        targetAccountUUID,
        currentAccountUUID,
        currentChatRoomUUID,
        publicProfile,
    );

    const relationship =
        targetAccountUUID === currentAccountUUID
            ? "myself"
            : protectedProfile !== undefined
            ? "friend"
            : "stranger";

    const ratingSummary =
        record !== undefined
            ? `래더 ${record.skillRating}점 (${record.winCount}승 / ${record.loseCount}패 / ${record.tieCount}무)`
            : "-";
    const rating: ProfileMenu = {
        name: ratingSummary,
        action: "noaction",
        relation: ["myself", "friend", "stranger"],
        scope: ["ChatRoom", "FriendModal", "Navigation"],
        isImportant: true,
        className: "hover:bg-transparent active:bg-transparent",
    };

    return (
        <ContextMenuBase>
            {type === "Navigation" && (
                <>
                    <ChangeVisibilityMenu />
                    <ChangeStatusMessageMenu
                        targetAccountUUID={targetAccountUUID}
                    />
                </>
            )}
            {[rating, ...menus]
                .filter((menu) => {
                    return (
                        menu.scope.includes(type) &&
                        roleLevel >= (menu.minRoleLevel ?? 0) &&
                        menu.relation.includes(relationship)
                    );
                })
                .map((menu) => {
                    return (
                        <ContextMenuItem
                            key={menu.name}
                            menuInfo={menu}
                            action={actions[menu.action]}
                        />
                    );
                })}
        </ContextMenuBase>
    );
}
