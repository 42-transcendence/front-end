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
    Game_Lose,
    IconExclamationMark,
} from "@/components/ImageLibrary";
import { TimeoutWrapper } from "./TimeoutWrapper";

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

function LeftFlag() {
    return (
        <Image
            className=""
            src={"/left-flag.png"}
            alt=""
            width="300"
            height="200"
        />
    );
}

function RightFlag() {
    return (
        <Image
            className=""
            src={"/right-flag.png"}
            alt=""
            width="300"
            height="200"
        />
    );
}

// TODO: fix logic: game score result, achievement, user info.
// decide win or lose
function GameResultBanner() {
    const scoreResult = { team1: 3, team2: 21 }
    const scoreStyle = {
        team1: scoreResult.team1 > scoreResult.team2 ? "text-[#FFD600]" : "",
        team2: scoreResult.team1 < scoreResult.team2 ? "text-[#FFD600]" : "", // TODO: win / lose / tie ?
    }

    function WinOrLoseMessage() {
        const winOrLose = true;
        return (
            <div className="flex flex-row gap-6">
                <Game_You width="120" height="120" />
                {winOrLose ? <Game_Win width="120" height="120" /> : <Game_Lose width="120" height="120" />}
                <IconExclamationMark
                    width="60"
                    height="60"
                    className="mt-7"
                />
            </div>
        );
    }

    function GameResultScore() {
        return (
            <div className="space-x-3 text-5xl">
                <span className={scoreStyle.team1}>{scoreResult.team1}</span>
                <span>:</span>
                <span className={scoreStyle.team2}>{scoreResult.team2}</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-center gap-6 px-[15rem] pb-24 pt-32">
                <LeftFlag />
                <div className="flex flex-col items-center justify-center px-12 py-5">
                    <WinOrLoseMessage />
                    <GameResultScore />
                </div>
                <RightFlag />
            </div>
        </>
    );
}

export default function Main() {
    return (
        <div>
            <div className="flex h-screen flex-col items-center backdrop-blur-lg">
                <TimeoutWrapper milliseconds={5000}>
                    <PositionTopLeft /> {/* NewAchievementCard */}
                </TimeoutWrapper>
                <PositionTopRight /> {/* PlayAgainCard */}
                <GameResultBanner />
                <div className="flex flex-row items-center gap-5">
                    <GameUserFrame />
                    <GameUserFrame />
                    <div className="m-6 h-[10rem] w-px bg-white"></div>
                    <GameUserFrame />
                    <GameUserFrame />
                </div>
                <div className="m-20"></div>
                {/* <TrophyCard /> */}
            </div>
        </div>
    );
}
