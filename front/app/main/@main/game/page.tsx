import { GameChipProfile } from "@/components/Game/GameUserProfile";
import CharacterSelector from "@/components/Game/GameCharacterSelector";
import GameStartButton from "@/components/Game/GameStartButton";
import { ChatDialog } from "@/components/Chat/ChatDialog";
import { IconChatAlternative } from "@/components/ImageLibrary";

export default function GamePage() {
    return (
        <div className="relative flex h-full flex-col items-center justify-start gap-2.5 overflow-auto rounded-lg p-6 backdrop-blur-3xl">
            <div className="flex h-full flex-row items-center justify-center rounded-lg bg-windowGlass/30 ">
                <div className="relative flex h-full flex-col items-center">
                    <input
                        type="checkbox"
                        id="chatBox"
                        className="peer hidden"
                    />
                    <label className="relative" htmlFor="chatBox">
                        <IconChatAlternative
                            width={64}
                            height={64}
                            className="p-4"
                        />
                    </label>
                    <ChatDialog
                        outerFrame="w-0 overflow-clip peer-checked:w-fit rounded-[32px] min-h-[200px]"
                        innerFrame="max-w-[600px]"
                    />
                </div>

                <div className="flex flex-col items-center justify-between self-stretch px-2.5 py-[30px]">
                    {/* name tag */}
                    <div className="gameNameTag flex w-full max-w-xl justify-around rounded-full py-2">
                        <div className="flex w-12 flex-col justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
                            TEAM PURPLE
                        </div>
                        <div className="flex w-12 justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
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
        </div>
    );
}
