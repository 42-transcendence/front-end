"use client";

import { makeMatchmakeHandshakeEnter } from "@common/game-payload-builder-client";
import { useGameMatchMakeConnector } from "@hooks/useGameWebSocketConnector";
import { useMemo } from "react";

export default function GameRedirectPage({
    params: { id },
}: {
    params: { id: string };
}) {
    useGameMatchMakeConnector(
        useMemo(() => makeMatchmakeHandshakeEnter(id), [id]),
    );

    return <div className="loading">게임방에 접속 중입니다</div>;
}
