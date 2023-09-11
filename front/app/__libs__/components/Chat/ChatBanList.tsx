import { useEffect, useState } from "react";
import { ProfileItemBlocked } from "@components/ProfileItem/ProfileItemBlocked";
import { makeBanListRequest } from "@akasha-utils/chat-payload-builder-client";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";
import { handleBanList } from "@akasha-utils/chat-gateway-client";
import { BanCategory, BanCategoryNumber } from "@common/generated/types";
import { ChatBanDetailEntry } from "@common/chat-payloads";

type BlockedUser = {
    accountUUID: string;
    memo: string;
    expireTimeStamp: Date;
};
const CommitBanList: BlockedUser[] = [
    {
        accountUUID: "123456",
        memo: "그냥",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "47789",
        memo: "그냥2",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "5123",
        memo: "그냥3",
        expireTimeStamp: new Date(),
    },
];

const AccessBanList: BlockedUser[] = [
    {
        accountUUID: "123",
        memo: "그냥",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "4",
        memo: "그냥2",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "5",
        memo: "그냥3",
        expireTimeStamp: new Date(),
    },
];

export function ChatAccessBanList() {
    const chatId = useCurrentChatRoomUUID();
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

    useEffect(() => {
        sendPayload(makeBanListRequest(chatId));
    }, [chatId, sendPayload]);

    const [selected, setSelected] = useState<number>();

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {accessBanlist?.map((detail, index) => {
                return (
                    <ProfileItemBlocked
                        key={index}
                        detail={detail}
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
    const chatId = useCurrentChatRoomUUID();
    const [CommitBanList, setCommitBanList] = useState<ChatBanDetailEntry[]>();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.BAN_LIST,
        (_, buffer) => {
            setCommitBanList(
                handleBanList(buffer).filter(
                    (e) => e.category === BanCategoryNumber.COMMIT,
                ),
            );
        },
    );

    useEffect(() => {
        sendPayload(makeBanListRequest(chatId));
    }, [chatId, sendPayload]);

    const [selected, setSelected] = useState<number>();

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {CommitBanList?.map((detail, index) => {
                return (
                    <ProfileItemBlocked
                        key={index}
                        detail={detail}
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
