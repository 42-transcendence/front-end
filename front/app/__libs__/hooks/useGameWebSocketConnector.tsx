"use client";

import { useCallback, useMemo } from "react";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@akasha-utils/react/websocket-hook";
import { ACCESS_TOKEN_KEY, HOST } from "@utils/constants";
import type { ByteBuffer } from "@akasha-lib";
import { useRouter } from "next/navigation";
import { GameClientOpcode } from "@common/game-opcodes";
import { useSetAtom } from "jotai";
import { InvitationAtom } from "@atoms/GameAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { handleInvitationPayload } from "@common/game-gateway-helper-client";

export function useGameMatchMakeConnector(buf: ByteBuffer) {
    const router = useRouter();
    const setInvitation = useSetAtom(InvitationAtom, { store: GlobalStore });
    const props = useMemo(
        () => ({
            handshake: () => buf.toArray(),
        }),
        [buf],
    );

    const getURL = useCallback(() => {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            return "";
        }
        return `wss://${HOST}/game?token=${accessToken}`;
    }, []);

    useWebSocketConnector("game", getURL, props);

    useWebSocket("game", GameClientOpcode.INVITATION, (_, buffer) => {
        setInvitation(handleInvitationPayload(buffer));
        router.push("/game");
    });
}

export function useGamePlayConnector(buf: ByteBuffer, connect: boolean = true) {
    const props = useMemo(
        () => ({
            handshake: () => buf.toArray(),
        }),
        [buf],
    );

    const getURL = useCallback(() => {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            return "";
        }
        return `wss://${HOST}/game?token=${accessToken}`;
    }, []);

    useWebSocketConnector(connect ? "game" : "", getURL, props);
}
