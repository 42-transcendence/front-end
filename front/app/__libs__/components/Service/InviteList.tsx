import { useState } from "react";
import { TextField } from "@components/TextField";
import { ProfileItemSelectable } from "@components/ProfileItem/ProfileItemSelectable";
import { FriendEntryListAtom } from "@atoms/FriendAtom";
import { useAtom, useAtomValue } from "jotai";
import { SelectedAccountUUIDsAtom } from "@atoms/AccountAtom";
import { GlobalStore } from "@atoms/GlobalStore";

import { useFzf } from "react-fzf";
import type { FriendEntry } from "@common/chat-payloads";

export function InviteList({ className }: { className?: string | undefined }) {
    const [query, setQuery] = useState("");
    const friendEntrySet = useAtomValue(FriendEntryListAtom, {
        store: GlobalStore,
    });
    const { results: foundFriendEntrySet } = useFzf({
        items: friendEntrySet,
        itemToString(item) {
            //TODO: fetch...? Fzf 지우기가 먼저인가?
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
