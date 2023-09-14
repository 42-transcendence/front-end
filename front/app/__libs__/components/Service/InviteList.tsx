import { useId, useState } from "react";
import { TextField } from "@components/TextField";
import { ProfileItemSelectable } from "@components/ProfileItem/ProfileItemSelectable";
import { FriendEntryListAtom } from "@atoms/FriendAtom";
import { useAtom, useAtomValue } from "jotai";
import { SelectedAccountUUIDsAtom } from "@atoms/AccountAtom";
import { GlobalStore } from "@atoms/GlobalStore";

import { useFzf } from "react-fzf";
import type { FriendEntry } from "@common/chat-payloads";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";
import { useChatRoomMembers } from "@hooks/useChatRoom";
import type { TypeWithProfile } from "@hooks/useProfile";
import { usePublicProfiles } from "@hooks/useProfile";
import type { AccountProfilePublicPayload } from "@common/profile-payloads";

export function InviteList({
    className,
    filterUnjoined,
}: {
    className?: string | undefined;
    filterUnjoined: boolean;
}) {
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const currentChatMembers = useChatRoomMembers(currentChatRoomUUID);
    const [query, setQuery] = useState("");
    const friendEntrySet = useAtomValue(FriendEntryListAtom, {
        store: GlobalStore,
    });
    const filteredEntrySet =
        filterUnjoined && currentChatMembers !== undefined
            ? friendEntrySet.filter(
                  (e) => !currentChatMembers.has(e.friendAccountId),
              )
            : [...friendEntrySet];

    const profiles = usePublicProfiles(
        useId(),
        filteredEntrySet,
        (e) => e.friendAccountId,
    );
    const { results: foundFriendEntrySet } = useFzf({
        items: profiles ?? [],
        itemToString(item) {
            const profile = item._profile;
            if (profile !== undefined) {
                return `${profile.nickName}#${profile.nickTag}`;
            }
            return "";
        },
        query,
    });
    const [selectedAccountUUIDs, setSelectedAccountUUIDs] = useAtom(
        SelectedAccountUUIDsAtom,
    );

    const handleClick = (item: FriendEntry) => () => {
        const selected = selectedAccountUUIDs.includes(item.friendAccountId);
        setSelectedAccountUUIDs(
            selected
                ? selectedAccountUUIDs.filter(
                      (uuid) => uuid !== item.friendAccountId,
                  )
                : [...selectedAccountUUIDs, item.friendAccountId],
        );
    };

    return (
        <form className={`group flex flex-col gap-2 ${className}`}>
            <TextField
                type="text"
                className="px-3"
                placeholder="Search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex h-full flex-col items-center gap-1 self-stretch overflow-auto">
                {foundFriendEntrySet
                    .toSorted((e1, e2) => comparePublicFriendEntry(e1, e2))
                    .map((item) => (
                        <ProfileItemSelectable
                            key={item.friendAccountId}
                            accountUUID={item.friendAccountId}
                            selected={selectedAccountUUIDs.includes(
                                item.friendAccountId,
                            )}
                            onClick={handleClick(item)}
                        />
                    ))}
            </div>
        </form>
    );
}

type PublicFriendCompareType = TypeWithProfile<
    FriendEntry,
    AccountProfilePublicPayload
>;

function comparePublicFriendEntry(
    e1: PublicFriendCompareType,
    e2: PublicFriendCompareType,
) {
    const profile1 = e1._profile;
    const profile2 = e2._profile;

    if (profile1 === undefined) return -1;
    if (profile2 === undefined) return 1;

    const nick1 = profile1.nickName ?? "";
    const nick2 = profile2.nickName ?? "";

    if (nick1 !== nick2) {
        return nick1 > nick2 ? 1 : -1;
    }

    return profile1.nickTag > profile2.nickTag ? 1 : -1;
}
