"use client";
import { useState } from "react";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { ButtonOnRight } from "@components/Button/ButtonOnRight";
import { makeMatchmakeHandshakeCreate } from "@common/game-payload-builder-client";
import { ByteBuffer } from "@akasha-lib";
import { Dialog } from "@headlessui/react";
import { configs, GameModeBlock, CreateGamePendding } from "./GameButton";

export function CreateNewGameRoom() {
    const [gameModeInfos, setGameModeInfos] = useState<ByteBuffer>();
    const [open, setOpen] = useState(false);

    return (
        <GlassWindow>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const target = event.target as HTMLFormElement;
                    const formData = new FormData(target);

                    const battleField = formData.get("FIELD");
                    const gameMode = formData.get("MDOE");
                    const limit = formData.get("LIMIT");

                    if (typeof battleField === "string" &&
                        typeof gameMode === "string" &&
                        typeof limit === "string") {
                        setGameModeInfos(
                            makeMatchmakeHandshakeCreate(
                                Number(battleField),
                                Number(gameMode),
                                Number(limit),
                                true
                            )
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
                            options={values} />
                    ))}
                </div>
                <ButtonOnRight
                    onClick={() => setOpen(!open)}
                    buttonText="만들기"
                    className="w-20 rounded-lg bg-gray-300/30 p-2" />
                {gameModeInfos !== undefined && (
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <div className="fixed inset-0" aria-hidden="true" />
                        <Dialog.Panel className="">
                            <CreateGamePendding buf={gameModeInfos} />
                            <button onClick={() => setOpen(false)}>취소</button>
                        </Dialog.Panel>
                    </Dialog>
                )}
            </form>
        </GlassWindow>
    );
}

