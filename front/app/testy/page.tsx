import { GameUserFrame } from "@/components/Game/GameUserFrame";
import {
    PlayAgainCard,
    NewAchievementCard,
    TrophyCard,
} from "@/components/Game/AfterGameCards";
import Image from "next/image";
import {
    Game_You,
    Game_Win,
    IconExclamationMark,
} from "@/components/ImageLibrary";

// TODO: 시간이 지나면 사라지는 기능 추가
function PositionTopLeft() {
    return (
        <div className="fixed box-border overflow-auto pt-[22rem] lg:ml-[-80%] lg:flex lg:pt-10">
            <NewAchievementCard />
        </div>
    );
}

// TODO: 시간이 지나면 사라지는 기능 추가
function PositionTopRight() {
    return (
        <div className="fixed box-border overflow-auto pt-10 lg:mr-[-80%] lg:flex">
            <PlayAgainCard />
        </div>
    );
}

function Score() {
    return (
        <>
            <PositionTopLeft /> {/* NewAchievementCard */}
            <PositionTopRight /> {/* PlayAgainCard */}
            <div className="flex items-center justify-center gap-6 px-[15rem] pb-24 pt-32">
                <Image
                    className=""
                    src={"/left-flag.png"}
                    alt="left-flag"
                    width="300"
                    height="200"
                />
                <div className="flex flex-col items-center justify-center px-12 py-5">
                    <div className="flex flex-row gap-6">
                        <Game_You width="120" height="120" />
                        <Game_Win width="120" height="120" />
                        <IconExclamationMark
                            width="60"
                            height="60"
                            className="mt-7"
                        />
                    </div>
                    <div className="space-x-3 text-5xl">
                        <span className="text-[#FFD600]">3</span>
                        <span className="">:</span>
                        <span className="">2</span>
                    </div>
                </div>
                <Image
                    className=""
                    src={"/right-flag.png"}
                    alt="right-flag"
                    width="300"
                    height="200"
                />
            </div>
        </>
    );
}

export default function Main() {
    return (
        <div>
            <div className="flex h-screen flex-col items-center bg-white/30">
                <Score />
                <div className="flex flex-row items-center gap-5">
                    <GameUserFrame />
                    <GameUserFrame />
                    <div className="m-6 h-[10rem] w-px bg-white"></div>
                    {/* TODO */}
                    <GameUserFrame />
                    <GameUserFrame />
                </div>
                <div className="m-20"></div>
                {/* <TrophyCard /> */}
            </div>
        </div>
    );
}
