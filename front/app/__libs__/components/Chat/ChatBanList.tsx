import { useEffect, useState } from "react";
import { ProfileItemBlocked } from "@components/ProfileItem/ProfileItemBlocked";
import { BanCategoryNumber } from "@common/generated/types";
import type { ChatBanDetailEntry } from "@common/chat-payloads";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { makeBanListRequest } from "@akasha-utils/chat-payload-builder-client";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";
import { handleBanList } from "@akasha-utils/chat-gateway-client";

export function ChatAccessBanList() {
    const [accessBanlist, setAccessBanList] = useState<ChatBanDetailEntry[]>();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.BAN_LIST,
        (_, buffer) => {
            setAccessBanList(
                handleBanList(buffer).filter(
                    (e) => e.category === BanCategoryNumber.ACCESS,
                ),
            );
        },
    );

    const [selected, setSelected] = useState<number>();
    const currentChatRoomId = useCurrentChatRoomUUID();
    useEffect(() => {
        sendPayload(makeBanListRequest(currentChatRoomId));
    }, [currentChatRoomId, sendPayload]);

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {accessBanlist?.map((entry, index) => {
                return (
                    <ProfileItemBlocked
                        key={index}
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

export function ChatCommitBanList() {
    const [sendBanList, setSendBanList] = useState<ChatBanDetailEntry[]>();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.BAN_LIST,
        (_, buffer) => {
            setSendBanList(
                handleBanList(buffer).filter(
                    (e) => e.category === BanCategoryNumber.COMMIT,
                ),
            );
        },
    );

    const [selected, setSelected] = useState<number>();
    const currentChatRoomId = useCurrentChatRoomUUID();
    useEffect(() => {
        sendPayload(makeBanListRequest(currentChatRoomId));
    }, [currentChatRoomId, sendPayload]);

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {sendBanList?.map((entry, index) => {
                return (
                    <ProfileItemBlocked
                        key={index}
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
