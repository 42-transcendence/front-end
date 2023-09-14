"use client";

import { useMemo, useState } from "react";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { ButtonOnRight } from "@components/Button/ButtonOnRight";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { makeMatchmakeHandshakeCreate } from "@common/game-payload-builder-client";
import type { MatchmakeFailedReason } from "@common/game-payloads";
import { BattleField, GameMode } from "@common/game-payloads";
import { GameClientOpcode } from "@common/game-opcodes";
import { Dialog } from "@headlessui/react";
import { handleMatchmakeFailed } from "@common/game-gateway-helper-client";
import { useAtom } from "jotai";
import { IsMatchMakingAtom } from "@atoms/GameAtom";
import { DoubleSharp } from "@components/ImageLibrary";
import { useGameWebSocketConnector } from "@hooks/useGameWebSocketConnector";

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
        <GlassWindow className="overflow-hidden">
            <form
                onSubmit={handleSubmit}
                className="group flex w-full flex-col gap-4 overflow-hidden rounded-[28px] p-4 backdrop-blur-[50px]"
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
                    className="w-20 rounded-xl bg-gray-300/30 p-2 group-valid:bg-green-500/70"
                />

                {isOpen && (
                    <Dialog open={isOpen} onClose={() => {}}>
                        <div
                            className="fixed inset-0 bg-black/30"
                            aria-hidden="true"
                        />

                        <Dialog.Panel className="absolute inset-4 inset-y-8 m-auto max-h-96 max-w-sm overflow-hidden lg:inset-32">
                            <div className="flex h-full w-full rounded-[28px] bg-windowGlass/30 backdrop-blur-[50px] ">
                                <CreateGamePendding
                                    infos={gameModeInfos}
                                    closeModal={closeModal}
                                />
                            </div>
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
    const [isFail, setIsFail] = useState<MatchmakeFailedReason>();

    useGameWebSocketConnector(
        useMemo(
            () =>
                makeMatchmakeHandshakeCreate(
                    infos.battleField,
                    infos.gameMode,
                    infos.limit,
                    infos.fair,
                ),
            [infos],
        ),
    );

    useWebSocket("game", GameClientOpcode.MATCHMAKE_FAILED, (_, buffer) => {
        setIsFail(handleMatchmakeFailed(buffer));
    });

    return (
        <div className="flex h-full w-full items-center justify-center p-4 pt-16">
            {isFail === undefined ? (
                <div className="flex h-full w-full flex-col items-center justify-between gap-2">
                    <DoubleSharp
                        tabIndex={0}
                        className={`$ w-12 rounded-lg p-2 text-white outline-none transition-all hover:drop-shadow-[0_0_0.3rem_#ffffff90] focus-visible:outline-primary/70 ${"animate-spin-slow ease-in-out"}`}
                        width={48}
                        height={48}
                    />
                    <div className="flex w-full justify-center">
                        <span className="w-16">로딩중</span>
                    </div>
                    <button
                        className="z-10 w-full rounded-xl p-4 font-normal text-gray-50/80 hover:bg-windowGlass/30 hover:font-bold"
                        onClick={() => closeModal()}
                    >
                        취소
                    </button>
                </div>
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
