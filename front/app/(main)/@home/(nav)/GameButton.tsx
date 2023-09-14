"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { ButtonOnRight } from "@components/Button/ButtonOnRight";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";

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
    config,
}: {
    keyName: string;
    config: string[];
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
                {config.map((item) => (
                    <label
                        key={item}
                        className={`flex w-20 justify-center rounded-lg p-2 outline-none  focus-within:outline-primary/70 ${
                            selected === item
                                ? "bg-secondary/30"
                                : "bg-gray-300/30"
                        }`}
                    >
                        <input
                            type="radio"
                            name={keyName}
                            value={item}
                            checked={selected === item}
                            onChange={() => setSelected(item)}
                            className="sr-only"
                        />
                        {item}
                    </label>
                ))}
            </div>
        </div>
    );
}

const configs = {
    field: ["동글동글", "네모네모"],
    mode: ["기본", "중력"],
    team: ["개인전", "협동전"],
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
                    const configs = [...formData.keys()];
                    console.log(configs);
                }}
                className="group flex w-full flex-col gap-4 p-4"
            >
                <div className="flex w-full flex-col gap-2 p-2">
                    {Object.entries(configs).map(([key, config]) => {
                        return (
                            <GameModeBlock
                                key={key}
                                keyName={key}
                                config={config}
                            />
                        );
                    })}
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
    //TODO: enter queue
    return <RoundButtonBase>Quick Match</RoundButtonBase>;
}
