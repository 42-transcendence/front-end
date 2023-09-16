import { EditPanelVisibilityAtom } from "@atoms/ProfileAtom";
import { Avatar } from "@components/Avatar";
import type { Relationship } from "@components/ContextMenu";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { useProtectedProfile, usePublicProfile } from "@hooks/useProfile";
import { useSetAtom } from "jotai";
import { Icon } from "@components/ImageLibrary";
import {
    makeAddFriendRequest,
    makeDeleteFriendRequest,
} from "@akasha-utils/chat-payload-builder-client";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";

export function ProfileSection({ accountUUID }: { accountUUID: string }) {
    const profile = usePublicProfile(accountUUID);
    //NOTE: protected는 친구 구별에 필요하다.
    const protectedProfile = useProtectedProfile(accountUUID);
    const currentId = useCurrentAccountUUID();

    const isLogined = currentId !== "";

    const relationship = isLogined
        ? accountUUID === currentId
            ? "myself"
            : protectedProfile !== undefined
            ? "friend"
            : "stranger"
        : "stranger";

    return (
        <div className="h-20 w-full shrink-0 bg-windowGlass/30 p-4 lg:h-full lg:w-28">
            <div className="flex w-full flex-row items-center justify-between gap-4 lg:flex-col">
                <div className="flex h-full w-full flex-row justify-start gap-4 lg:flex-col">
                    <Avatar
                        accountUUID={accountUUID}
                        className="relative h-12 w-12 bg-white/30 lg:h-20 lg:w-20"
                        privileged={relationship !== "stranger"}
                    />
                    <div className="flex w-full flex-col items-start justify-center text-base md:text-lg lg:text-xl">
                        <h1>{profile?.nickName}</h1>
                        <h2 className="text-xs text-gray-300/70 md:text-sm lg:text-base">
                            {profile?.nickTag}
                        </h2>
                    </div>
                </div>
                <RelationshipButton
                    relationship={relationship}
                    targetAccountUUID={accountUUID}
                />
            </div>
        </div>
    );
}

function RelationshipButton({
    relationship,
    targetAccountUUID,
}: {
    relationship: Relationship;
    targetAccountUUID: string;
}) {
    const showEditPanel = useSetAtom(EditPanelVisibilityAtom);
    const targetProfile = usePublicProfile(targetAccountUUID);
    const { sendPayload } = useWebSocket("chat", []);

    const nickName = targetProfile?.nickName ?? "fallback";

    const addfriend = () => {
        sendPayload(makeAddFriendRequest(targetAccountUUID, "", 0b11111111));
    };
    const deletefriend = () => {
        if (
            confirm(
                `진짜로 정말로 [${nickName}]님을 친구 목록에서 삭제하실건가요...?`,
            )
        ) {
            sendPayload(makeDeleteFriendRequest(targetAccountUUID));
        }
    };

    switch (relationship) {
        case "myself":
            return (
                <button
                    type="button"
                    onClick={() => showEditPanel((value) => !value)}
                    className="relative flex h-8 items-center justify-center rounded-xl bg-secondary p-2 lg:w-full"
                >
                    <span className="text-sm">Edit</span>
                </button>
            );
        case "friend":
            return (
                <button
                    type="button"
                    onClick={() => deletefriend()}
                    className="relative flex h-8 items-center justify-center rounded-xl bg-green-500 p-2 lg:w-full"
                >
                    <Icon.Check width={16} height={16} />
                </button>
            );
        case "stranger":
            return (
                <button
                    type="button"
                    onClick={() => addfriend()}
                    className="relative flex h-8 items-center justify-center rounded-xl bg-gray-500 p-2 lg:w-full"
                >
                    <Icon.Plus width={16} height={16} />
                </button>
            );
    }
}
