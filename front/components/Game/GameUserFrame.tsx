import GameUserProfile from "./GameUserProfile";
import { GameUserRoundScore } from "./GameUserRoundScore";
import { IconCrownFilled } from "@/components/ImageLibrary";

type gameScore = {
    originScore: number;
    changeAmount: number;
};

const dummyData: gameScore = {
    originScore: 1024,
    changeAmount: 37,
};

export function GameUserFrame() {
    return (
        <>
            <div className="flex flex-col items-center rounded-[35px] bg-black/70 px-[38px] pb-[23px] pt-[30px]">
                <IconCrownFilled width="48" height="48" />
                <GameUserProfile />
                {/* round score */}
                <GameUserRoundScore />
                <GameUserRoundScore />
                <GameUserRoundScore />
                {/* 절취선 */}
                <div className="flex flex-col items-center justify-center gap-2.5 px-[125px] pb-5 pt-10">
                    <div className="h-px w-[54px] bg-white"></div>
                </div>
                <div className="flex flex-col items-center gap-1.5 px-[3rem] py-[3rem]">
                    <div className="flex flex-col justify-center text-center text-base font-bold italic text-white">
                        누적 포인트
                    </div>
                    <div className="flex h-10 flex-row justify-center text-center text-2xl font-bold italic text-white">
                        <div className="p-1">1024</div>
                        <div className="p-1 text-[#FFD600]">[+37]</div>
                    </div>
                    <div className="flex flex-col justify-center text-center text-[64px] font-bold italic leading-[normal] text-[#FFD600]">
                        {dummyData.originScore + dummyData.changeAmount}
                    </div>
                </div>
            </div>
        </>
    );
}
