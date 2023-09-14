import { GameChipProfile } from "@components/Game/GameUserProfile";
import CharacterSelector from "@components/Game/GameCharacterSelector";
import GameStartButton from "@components/Game/GameStartButton";
import Link from "next/link";

function InvalidGameIdPage() {
    return (
        <main className="relative flex h-full flex-col items-center justify-end gap-2.5 self-stretch p-2.5">
            <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col items-center justify-between self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex items-center gap-[250px] rounded-[50px] px-[106px] py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
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
        <main className="relative flex h-full flex-col items-center justify-end gap-2.5 self-stretch p-2.5">
            <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col items-center justify-between self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex items-center gap-[250px] rounded-[50px] px-[106px] py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
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
        <main className="relative flex h-full flex-col items-center justify-end gap-2.5 self-stretch p-2.5">
            <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col items-center justify-between self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex items-center gap-[250px] rounded-[50px] px-[106px] py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
                            TEAM PURPLE
                        </div>
                        <div className="flex justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
                            TEAM CHERRY
                        </div>
                    </div>

                    {/* players - game chip component inside*/}
                    <div className="flex flex-row items-center justify-center px-0 pb-[50px] pt-[40px]">
                        <GameChipProfile />
                        <GameChipProfile />
                        <div className="flex w-40 shrink-0 items-center justify-center gap-2.5 px-[30px] py-[19px]">
                            <div className="h-[100px] w-px border-dashed bg-white"></div>
                        </div>
                        <GameChipProfile />
                        <GameChipProfile />
                    </div>

                    {/* game main bar - for operation */}
                    <div className="relative flex flex-col items-center justify-center gap-10 self-stretch lg:flex-row">
                        {/* TODO: selectable chatting room / if selected, shurink other one (chat / character select)*/}
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

export default function GamePage({
    params,
}: {
    params: { id?: string[] | undefined };
}) {
    if (params["id"] === undefined) {
        return <InputGameIdPage />;
    }

    if (!isValidGameId(params.id)) {
        return <InvalidGameIdPage />;
    }

    return <GameWaitingPage />;
}
