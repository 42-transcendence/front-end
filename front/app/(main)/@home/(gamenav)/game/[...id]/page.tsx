"use client";

import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { handleMatchmakeFailed } from "@common/game-gateway-helper-client";
import { GameClientOpcode } from "@common/game-opcodes";
import { makeMatchmakeHandshakeEnter } from "@common/game-payload-builder-client";
import { MatchmakeFailedReason } from "@common/game-payloads";
import { useGameMatchMakeConnector } from "@hooks/useGameWebSocketConnector";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function GameRedirectPage({
    params: { id },
}: {
    params: { id: string };
}) {
    const router = useRouter();
    useGameMatchMakeConnector(
        useMemo(() => makeMatchmakeHandshakeEnter(id), [id]),
    );
    useWebSocket("game", GameClientOpcode.MATCHMAKE_FAILED, (_, buffer) => {
        const errno = handleMatchmakeFailed(buffer);
        router.push("/");
        let msg = "";
        switch (errno) {
            case MatchmakeFailedReason.UNKNOWN:
                msg = "알 수 없는 이유로 참여에 실패했습니다.";
                break;
            case MatchmakeFailedReason.DUPLICATE:
                msg = "이미 다른 창에서 게임에 참여중입니다.";
                break;
            case MatchmakeFailedReason.NOT_FOUND:
                msg = "해당하는 게임 방을 찾지 못했습니다.";
                break;
        }
        if (msg !== "") {
            alert(msg);
        }
    });

    return <div className="loading">게임방에 접속 중입니다</div>;
}
