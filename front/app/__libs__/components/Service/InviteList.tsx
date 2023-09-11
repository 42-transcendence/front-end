import { useState } from "react";
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
    const friendEntrySetUnjoinedOnly = friendEntrySet.filter(
        (e) =>
            currentChatMembers !== undefined &&
            !currentChatMembers.has(e.friendAccountId),
    );
    const { results: foundFriendEntrySet } = useFzf({
        items: filterUnjoined ? friendEntrySetUnjoinedOnly : friendEntrySet,
        itemToString(item) {
            //TODO: JKONG: useProfiles로 가져와서 이름 띄워주기.
            return item.friendAccountId;
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
                {foundFriendEntrySet.map((item) => (
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
