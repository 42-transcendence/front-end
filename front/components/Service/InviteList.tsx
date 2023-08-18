import { useUUIDSet } from "@/hooks/UUIDSetContext";
import { useState } from "react";
import { TextField } from "@/components/TextField";
import { FzfHighlight, useFzf } from "react-fzf";
import { ProfileItemSelectable } from "@/components/ProfileItem/ProfileItemSelectable";

//TODO: 이거 지우기
const FriendListMockup = [
    { accountUUID: "123", tag: "42" },
    { accountUUID: "0eb0761e-4b92-41ea-ae6d", tag: "a3746330085e" },
    { accountUUID: "be67e302-27a3-460d-9fcf", tag: "59b3d8d9460b" },
    { accountUUID: "e3eb8922-ce6d-4eb0-991e", tag: "1a7dc7d9ce7f" },
    { accountUUID: "b5e0840d-7ba2-4836-a775", tag: "8dac118a8e20" },
    { accountUUID: "2e2202cc-7687-4824-9831", tag: "f2c2fd7450ea" },
    { accountUUID: "614c0bcc-1dd1-4c8d-be7c", tag: "f8f5f0889a32" },
    { accountUUID: "c2104808-a9f5-44d5-afa3", tag: "38a2e73290eb" },
    { accountUUID: "20ba35c9-69bb-4c62-ab53", tag: "fc9c89452b61" },
    { accountUUID: "fe5429ea-d841-4301-98c1", tag: "9ae9fa40ab81" },
];

export function InviteList({ className }: { className?: string | undefined }) {
    const [query, setQuery] = useState("");
    const { results, getFzfHighlightProps } = useFzf({
        //TODO: Change mockup to real data with fetch!!
        items: FriendListMockup,
        itemToString(item) {
            return item.accountUUID + "#" + item.tag;
        },
        query,
    });
    const [hasAccountUUID, toggleAccountUUID] = useUUIDSet();

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
                {results.map((item, index) => {
                    return (
                        <ProfileItemSelectable
                            key={item.accountUUID}
                            accountUUID={item.accountUUID}
                            selected={hasAccountUUID(item.accountUUID)}
                            onClick={() => toggleAccountUUID(item.accountUUID)}
                        >
                            <FzfHighlight
                                {...getFzfHighlightProps({
                                    index,
                                    item,
                                    className: "text-yellow-500",
                                })}
                            />
                        </ProfileItemSelectable>
                    );
                })}
            </div>
        </div>
    );
}
