"use client";

import { useCurrentAccountUUID } from "@/hooks/useCurrent";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatStore } from "@/library/idb/chat-store";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { ChatRoomChatMessagePairEntry, writeChatRoomChatMessagePair } from "@/library/payload/chat-payloads";
import { GameClientOpcode, GameServerOpcode } from "@/library/payload/game-opcodes";
import { useWebSocket, useWebSocketConnector } from "@/library/react/websocket-hook";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function CreateGameButton() {
    const router = useRouter();
    //TODO: make form for new game room
    const currentAccountUUID = useCurrentAccountUUID();
    const props = useMemo(
        () => ({
            handshake: async () => {
                const buf = ByteBuffer.createWithOpcode(GameServerOpcode.CREATE);
                return buf.toArray();
            },
        }),
        [currentAccountUUID],
    );

    useWebSocketConnector("game", "ws://localhost:3001/game", props);
    const { sendPayload } = useWebSocket("game", [GameClientOpcode.ACCEPT], async (opcode, buf) => {
        const uuid = buf.readUUID();
        //TODO: UUID to hash value that indicate game room.
        router.push(`/game/${uuid}`);
    });

    void sendPayload;

    return <GameButtonBase >Create Game</GameButtonBase>;
}

export function QuickMatchButton() {
    const router = useRouter();

    // FIXME: 실제로 fetch 하면 시간 걸리니까 일단 편의상 만들어둔 dummy async 함수
    const asyncRoute = async () => {
        await new Promise((res) => setTimeout(res, 0));
        router.push("/game/4242");

    };

    // TODO: 실제로는 백에서 채팅방 받아와야. fetch할때 방 정보, 모드 등 parameter로 붙여서 요청
    // const handleClick = async () => {

    //     const res = await fetch(
    //         "https://www.random.org/integers/?num=1&min=1&max=1000&col=1&base=10&format=plain&rnd=new",
    //         { next: { revalidate: 0 } },
    //     );
    //     if (!res.ok) {
    //         throw new Error("fetch failure");
    //     }
    //     const newGameId = await res.json();

    //     router.push(`/game/${newGameId}`);
    // }

    return <RoundButtonBase onClick={asyncRoute}>Quick Match</RoundButtonBase>;
}
