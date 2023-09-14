"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { ButtonOnRight } from "@components/Button/ButtonOnRight";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { makeMatchmakeHandshakeCreate } from "@common/game-payload-builder-client";
import { BattleField, GameMode } from "@common/game-payloads";
import { MatchMakingAtom } from "@atoms/GameAtom";
import { useAtom, useSetAtom } from "jotai";

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
            <div className="flex w-full flex-row justify-between px-2">
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

const configs = {
    battleField: [
        { name: "동글동글", value: BattleField.SQUARE },
        { name: "네모네모", value: BattleField.ROUND },
    ],
    gameMode: [
        { name: "기본", value: GameMode.UNIFORM },
        { name: "중력", value: GameMode.GRAVITY },
    ],
    limit: [
        { name: "개인전", value: 2 },
        { name: "협동전", value: 4 },
    ],
};

function CreateNewGameRoom() {
    const { sendPayload } = useWebSocket("game", []);

    return (
        <GlassWindow>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const target = event.target as HTMLFormElement;
                    const formData = new FormData(target);

                    const battleField = formData.get("battleField");
                    const gameMode = formData.get("gameMode");
                    const limit = formData.get("limit");

                    if (
                        typeof battleField === "string" &&
                        typeof gameMode === "string" &&
                        typeof limit === "string"
                    ) {
                        sendPayload(
                            makeMatchmakeHandshakeCreate(
                                Number(battleField),
                                Number(gameMode),
                                Number(limit),
                                true,
                            ),
                        );
                    }
                }}
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
            </form>
        </GlassWindow>
    );
}

export function QuickMatchButton() {
    const [isMatchMaking, setMatchMaking] = useAtom(MatchMakingAtom);

    return (
        <RoundButtonBase
            onClick={() => setMatchMaking(true)}
            disabled={isMatchMaking}
        >
            Quick Match
        </RoundButtonBase>
    );
}
