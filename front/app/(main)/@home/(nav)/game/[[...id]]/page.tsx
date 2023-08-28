"use client";

import { GameChipProfile } from "@/components/Game/GameUserProfile";
import CharacterSelector from "@/components/Game/GameCharacterSelector";
import GameStartButton from "@/components/Game/GameStartButton";
import Link from "next/link";
import { ChatDialog } from "@/components/Chat/ChatDialog";
import { useParams } from "next/navigation";

function InvalidGameIdPage() {
    return (
        <main className="flex relative flex-col gap-2.5 justify-end items-center self-stretch p-2.5 h-full">
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-between items-center self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex items-center gap-[250px] rounded-[50px] px-[106px] py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col justify-center text-2xl italic font-bold text-center text-white leading-[normal]">
                            Invalid Game Id
                        </div>
                        <Link href="/">Go to main</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function InputGameIdPage() {
    return (
        <main className="flex relative flex-col gap-2.5 justify-end items-center self-stretch p-2.5 h-full">
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-between items-center self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex items-center gap-[250px] rounded-[50px] px-[106px] py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col justify-center text-2xl italic font-bold text-center text-white leading-[normal]">
                            <p>Input Game Id</p>
                            <input
                                className="text-black"
                                type="text"
                                placeholder="4242"
                            />
                        </div>
                        <Link href="/">Go to main</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function GameWaitingPage() {
    return (
        <main className="flex relative flex-col gap-2.5 justify-end items-center self-stretch p-2.5 h-full">
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-between items-center self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex items-center gap-[250px] rounded-[50px] px-[106px] py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col justify-center text-2xl italic font-bold text-center text-white leading-[normal]">
                            TEAM PURPLE
                        </div>
                        <div className="flex justify-center text-2xl italic font-bold text-center text-white leading-[normal]">
                            TEAM CHERRY
                        </div>
                    </div>

                    {/* players - game chip component inside*/}
                    <div className="flex flex-row justify-center items-center px-0 pb-[50px] pt-[40px]">
                        <GameChipProfile />
                        <GameChipProfile />
                        <div className="flex gap-2.5 justify-center items-center w-40 shrink-0 px-[30px] py-[19px]">
                            <div className="w-px bg-white border-dashed h-[100px]"></div>
                        </div>
                        <GameChipProfile />
                        <GameChipProfile />
                    </div>

                    {/* game main bar - for operation */}
                    <div className="flex relative flex-col gap-10 justify-center items-center self-stretch lg:flex-row">
                        {/* TODO: selectable chatting room / if selected, shurink other one (chat / character select)*/}
                        <ChatDialog
                            outerFrame="rounded-[32px] min-h-[200px]"
                            innerFrame="max-w-[600px]"
                        />
                        <CharacterSelector />
                        <GameStartButton />
                    </div>
                </div>
            </div>
        </main>
    );
}

function isValidGameId(id: string | string[]) {
    if (!Array.isArray(id)) return false;
    return id.length === 1 && Number.isInteger(Number(id));
}

export default function GamePage() {
    const params = useParams();

    const paramKeys = Object.keys(params);
    if (paramKeys.length !== 1 || paramKeys[0] !== "id") {
        return <InputGameIdPage />;
    }

    if (!isValidGameId(params.id)) {
        return <InvalidGameIdPage />;
    }

    return <GameWaitingPage />;
}
