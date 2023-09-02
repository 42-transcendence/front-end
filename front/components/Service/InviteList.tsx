import { useState } from "react";
import { TextField } from "@/components/TextField";
import { ProfileItemSelectable } from "@/components/ProfileItem/ProfileItemSelectable";
import { FriendEntryAtom } from "@/atom/FriendAtom";
import { useAtom, useAtomValue } from "jotai";
import { SelectedAccountUUIDsAtom } from "@/atom/AccountAtom";
import { GlobalStore } from "@/atom/GlobalStore";

import { useFzf } from "react-fzf";

export function InviteList({ className }: { className?: string | undefined }) {
    const [query, setQuery] = useState("");
    const friendEntrySet = useAtomValue(FriendEntryAtom, {
        store: GlobalStore,
    });
    const { results: foundFriendEntrySet } = useFzf({
        items: friendEntrySet,
        itemToString(item) {
            //TODO: fetch...? Fzf 지우기가 먼저인가?
            return item.uuid;
        },
        query,
    });
    const [selectedAccountUUIDs, setSelectedAccountUUIDs] = useAtom(
        SelectedAccountUUIDsAtom,
    );

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
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
                        key={item.uuid}
                        accountUUID={item.uuid}
                        selected={selectedAccountUUIDs.includes(item.uuid)}
                        onClick={() => {
                            const selected = selectedAccountUUIDs.includes(
                                item.uuid,
                            );
                            setSelectedAccountUUIDs(
                                selected
                                    ? selectedAccountUUIDs.filter(
                                          (uuid) => uuid !== item.uuid,
                                      )
                                    : [...selectedAccountUUIDs, item.uuid],
                            );
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
