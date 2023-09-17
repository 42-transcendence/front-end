"use client";

import { GameRoomEnterResult } from "@common/game-payloads";

export function handleGameError(errno: GameRoomEnterResult) {
    let message = "";
    switch (errno) {
        case GameRoomEnterResult.EXPIRED_INVITATION:
            message = "만료된 게임입니다";
            break;
        case GameRoomEnterResult.ACCOUNT_MISMATCH:
            message = "계정 정보가 잘못되었습니다";
            break;
        case GameRoomEnterResult.SERVER_MISMATCH:
            message = "서버 정보가 잘못되었습니다";
            break;
        case GameRoomEnterResult.NOT_FOUND:
            message = "해당 게임을 찾을 수 없습니다";
            break;
        case GameRoomEnterResult.EXCEED_LIMIT:
            message = "방 정원이 초과되었습니다";
            break;
        case GameRoomEnterResult.ALREADY_STARTED:
            message = "이미 시작된 게임입니다";
            break;
        case GameRoomEnterResult.GAME_MISMATCH:
            message = "게임 정보가 잘못되었습니다";
            break;
        default:
            break;
    }
    if (message !== "") {
        alert(message);
    }
}
