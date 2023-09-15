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

    return <div>기다리세요</div>;
}
