import { CreateGameButton, QuickMatchButton } from "./GameButton";
import { Ghost3 } from "./Ghost3";
import { LogoutButton } from "./LogoutButton";

function HelloWorldPaper() {
    return (
        <div className="min-w-max">
            <div className="flex flex-row gap-[25px] pt-[10px]">
                <Ghost3 />
                <div className="flex flex-col pb-[59px] text-center text-[32px] font-bold italic leading-[45px] text-[#00FFD1]">
                    <div>HELLO, IT&lsquo;S</div>
                    <div>DOUBLE SHARP!</div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="pb-[46px] text-center text-[24px] font-bold not-italic leading-[45px] text-white">
                    <div>안녕하세요! 당신을 위한 핑퐁 게임,</div>
                    <div>[더블샵]에 오신 것을 환영합니다!</div>
                </div>
                <div className="text-center text-base font-bold not-italic leading-[28px] text-white">
                    <p>새 게임 만들기 - Create Game</p>
                    <p>빠른 대전 - Quick Match</p>
                </div>
                <div className="pt-[20px] text-center text-base font-normal italic leading-5 text-white text-white/30">
                    @42-transendence
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-black/30 lg:backdrop-blur-[3px]">
            <div className="flex flex-[1_0_0] flex-col items-center justify-center gap-2.5 self-stretch lg:flex-row">
                <div className="flex flex-col items-start">
                    <HelloWorldPaper />
                </div>

                <div className="flex h-[300px] flex-col items-center justify-center gap-[30px] px-[75px] py-[69px]">
                    <QuickMatchButton />
                    <CreateGameButton />
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
