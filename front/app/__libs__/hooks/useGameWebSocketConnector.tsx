"use client";
import { useCallback, useMemo } from "react";
import { useWebSocketConnector } from "@akasha-utils/react/websocket-hook";
import { ACCESS_TOKEN_KEY, HOST } from "@utils/constants";
import type { ByteBuffer } from "@akasha-lib";

export function useGameWebSocketConnector(buf: ByteBuffer) {
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
}
