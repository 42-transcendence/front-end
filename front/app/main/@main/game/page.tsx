import { GameChipProfile } from "@/components/Game/GameUserProfile";
import GameChat from "@/components/Game/GameChat";
import CharacterSelector from "@/components/Game/GameCharacterSelector";
import GameStartButton from "@/components/Game/GameStartButton";

export default function GamePage() {
    return (
        <div className="flex shrink-0 flex-col items-center justify-end justify-between gap-2.5 self-stretch p-2.5 backdrop-blur-[3px]">
            <div className="flex shrink-0 flex-col items-center justify-center ">
                <div className="flex flex-[1_0_0] flex-col items-center justify-between self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag">
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
                    <div className="flex items-end justify-center gap-10 self-stretch px-5 py-[34px]">
                        <GameChat />
                        <CharacterSelector />
                        <GameStartButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
