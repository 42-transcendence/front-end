import { EditPanelVisibilityAtom } from "@atoms/ProfileAtom";
import { Avatar } from "@components/Avatar";
import type { Relationship } from "@components/ContextMenu";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { useProtectedProfile } from "@hooks/useProfile";
import { useSetAtom } from "jotai";
import { Icon } from "@components/ImageLibrary";

export function ProfileSection({ accountUUID }: { accountUUID: string }) {
    const profile = useProtectedProfile(accountUUID);
    const currentId = useCurrentAccountUUID();

    const isLogined = currentId !== "";

    const relationship = isLogined
        ? accountUUID === currentId
            ? "myself"
            : profile !== undefined
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
                <RelationshipButton relationship={relationship} />
            </div>
        </div>
    );
}

function RelationshipButton({ relationship }: { relationship: Relationship }) {
    const showEditPanel = useSetAtom(EditPanelVisibilityAtom);

    switch (relationship) {
        case "myself":
            return (
                <button
                    onClick={() => showEditPanel((value) => !value)}
                    className="relative flex h-8 items-center justify-center rounded-xl bg-secondary p-2 lg:w-full"
                >
                    <span className="text-sm">Edit</span>
                </button>
            );
        case "friend":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-green-500 p-2 lg:w-full">
                    <Icon.Check width={16} height={16} />
                </button>
            );
        case "stranger":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-gray-500 p-2 lg:w-full">
                    <Icon.Plus width={16} height={16} />
                </button>
            );
    }
}
