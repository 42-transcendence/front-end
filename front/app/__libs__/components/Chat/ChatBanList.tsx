import { useEffect, useState } from "react";
import { ProfileItemBlocked } from "@components/ProfileItem/ProfileItemBlocked";
import type { ChatBanDetailEntry } from "@common/chat-payloads";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { makeBanListRequest } from "@akasha-utils/chat-payload-builder-client";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";
import { handleBanList } from "@akasha-utils/chat-gateway-client";
import { isDirectChatKey } from "@akasha-utils/idb/chat-store";
import type { BanCategoryNumber } from "@common/generated/types";

export function ChatBanList({
    banCategory,
}: {
    banCategory: BanCategoryNumber;
}) {
    const [banList, setBanList] = useState<ChatBanDetailEntry[]>();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.BAN_LIST,
        (_, buffer) => {
            setBanList(
                handleBanList(buffer).filter((e) => e.category === banCategory),
            );
        },
    );

    const [selected, setSelected] = useState<number>();
    const currentChatRoomId = useCurrentChatRoomUUID();
    useEffect(() => {
        if (!isDirectChatKey(currentChatRoomId)) {
            sendPayload(makeBanListRequest(currentChatRoomId));
        }
    }, [currentChatRoomId, sendPayload]);

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {banList?.map((entry, index) => {
                return (
                    <ProfileItemBlocked
                        key={entry.accountId}
                        entry={entry}
                        selected={selected === index}
                        onClick={() =>
                            setSelected(selected !== index ? index : undefined)
                        }
                    />
                );
            })}
        </div>
    );
}
