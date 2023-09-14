"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { ButtonOnRight } from "@components/Button/ButtonOnRight";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@akasha-utils/react/websocket-hook";
import { makeMatchmakeHandshakeCreate } from "@common/game-payload-builder-client";
import type { MatchmakeFailedReason } from "@common/game-payloads";
import { BattleField, GameMode } from "@common/game-payloads";
import { GameClientOpcode } from "@common/game-opcodes";
import { Dialog } from "@headlessui/react";
import { ACCESS_TOKEN_KEY, HOST } from "@utils/constants";
import {
    handleInvitationPayload,
    handleMatchmakeFailed,
} from "@common/game-gateway-helper-client";
import { useAtom } from "jotai";
import { InvitationAtom, IsMatchMakingAtom } from "@atoms/GameAtom";
import { useRouter } from "next/navigation";

type GameInfoType = {
    battleField: BattleField;
    gameMode: GameMode;
    limit: number;
    fair: boolean;
};

const configs = {
    FIELD: [
        { name: "동글동글", value: BattleField.SQUARE },
        { name: "네모네모", value: BattleField.ROUND },
    ],
    MODE: [
        { name: "기본", value: GameMode.UNIFORM },
        { name: "중력", value: GameMode.GRAVITY },
    ],
    LIMIT: [
        { name: "개인전", value: 2 },
        { name: "협동전", value: 4 },
    ],
};

function GameModeBlock({
    keyName,
    options,
}: {
    keyName: string;
    options: { name: string; value: BattleField | GameMode | number }[];
}) {
    const [selected, setSelected] = useState("");

    return (
        <div className="flex flex-row items-center justify-center gap-2">
            <span
                className={`w-20 shrink-0 p-2 text-lg ${
                    selected !== "" ? "text-white" : "text-gray-500/70"
                }`}
            >
                {keyName}
            </span>
            <div className="flex w-full flex-row justify-between gap-2 p-1">
                {options.map((option) => (
                    <label
                        key={option.name}
                        className={`flex w-20 justify-center rounded-lg p-2 outline-none  focus-within:outline-primary/70 ${
                            selected === option.name
                                ? "bg-secondary/30"
                                : "bg-gray-300/30"
                        }`}
                    >
                        <input
                            type="radio"
                            name={keyName}
                            value={option.value}
                            checked={selected === option.name}
                            onChange={() => setSelected(option.name)}
                            className="sr-only"
                            required={true}
                        />
                        {option.name}
                    </label>
                ))}
            </div>
        </div>
    );
}

function CreateNewGameRoom() {
    const [gameModeInfos, setGameModeInfos] = useState<GameInfoType>();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);

        const [battleField, gameMode, limit] = ["FIELD", "MODE", "LIMIT"].map(
            (key) => formData.get(key),
        );

        if (
            typeof battleField !== "string" ||
            typeof gameMode !== "string" ||
            typeof limit !== "string"
        ) {
            return;
        }

        setGameModeInfos({
            battleField: Number(battleField),
            gameMode: Number(gameMode),
            limit: Number(limit),
            fair: true,
        });
    };

    const isOpen = gameModeInfos !== undefined;
    const closeModal = () => setGameModeInfos(undefined);

    return (
        <GlassWindow>
            <form
                onSubmit={handleSubmit}
                className="group flex w-full flex-col gap-4 p-4"
            >
                <div className="flex w-full flex-col gap-2 p-2">
                    {Object.entries(configs).map(([key, values]) => (
                        <GameModeBlock
                            key={key}
                            keyName={key}
                            options={values}
                        />
                    ))}
                </div>
                <ButtonOnRight
                    buttonText="만들기"
                    className="w-20 rounded-lg bg-gray-300/30 p-2"
                />

                {isOpen && (
                    <Dialog onClose={() => closeModal()}>
                        <div className="fixed inset-0" aria-hidden="true" />
                        <Dialog.Panel className="h-full w-full">
                            <CreateGamePendding
                                infos={gameModeInfos}
                                closeModal={closeModal}
                            />
                            <button onClick={() => closeModal()}>취소</button>
                        </Dialog.Panel>
                    </Dialog>
                )}
            </form>
        </GlassWindow>
    );
}

function CreateGamePendding({
    infos,
    closeModal,
}: {
    infos: GameInfoType;
    closeModal: () => void;
}) {
    const [invitationAtom, setInvitationAtom] = useAtom(InvitationAtom);
    const router = useRouter();

    const getURL = useCallback(() => {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            return "";
        }
        return `wss://${HOST}/game?token=${accessToken}`;
    }, []);

    const buf = useMemo(
        () =>
            makeMatchmakeHandshakeCreate(
                infos.battleField,
                infos.gameMode,
                infos.limit,
                infos.fair,
            ),
        [infos.battleField, infos.fair, infos.gameMode, infos.limit],
    );

    const props = useMemo(
        () => ({
            handshake: () => buf.toArray(),
        }),
        [buf],
    );

    useEffect(() => {
        if (invitationAtom !== "") {
            router.push("/game");
        }
    }, [invitationAtom, router]);

    useWebSocketConnector("game", getURL, props);

    const [isFail, setIsFail] = useState<MatchmakeFailedReason>();

    useWebSocket(
        "game",
        [GameClientOpcode.INVITATION, GameClientOpcode.MATCHMAKE_FAILED],
        (opcode, buffer) => {
            switch (opcode) {
                case GameClientOpcode.INVITATION: {
                    setInvitationAtom(handleInvitationPayload(buffer));
                    return;
                }
                case GameClientOpcode.MATCHMAKE_FAILED: {
                    setIsFail(handleMatchmakeFailed(buffer));
                    return;
                }
            }
        },
    );

    return (
        <div>
            {isFail === undefined ? (
                <div>로딩중...</div>
            ) : (
                <button onClick={() => closeModal()}>
                    에러가 발생했습니다. 닫기
                </button>
            )}
        </div>
    );
}

export function QuickMatchButton() {
    const [isMatchMaking, setMatchMaking] = useAtom(IsMatchMakingAtom);

    return (
        <RoundButtonBase
            onClick={() => setMatchMaking(true)}
            disabled={isMatchMaking}
        >
            Quick Match
        </RoundButtonBase>
    );
}

export function CreateGameButton() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-fit w-full flex-col gap-4">
            <RoundButtonBase onClick={() => setOpen(!open)}>
                Create Game
            </RoundButtonBase>
            {open && <CreateNewGameRoom />}
        </div>
    );
}
