import { IconStarFilled } from "@/components/ImageLibrary";
import { IconCheck } from "@/components/ImageLibrary";

import Image from "next/image";

type TrophyImages = {
    profileImage: string;
    type: "bronze" | "gold" | "ruby" | "platinum";
};

const dummyTrophy: TrophyImages = {
    profileImage: "/game/skin-platinum.png",
    type: "platinum",
};
//TODO: 고정길이 px로 된 것들 적절한 auto값으로 바꿔주기~!!

export function PlayAgainCard() {
    return (
        <>
            <div className="flex items-center justify-between rounded-[30px] bg-black/50 px-8 lg:py-6">
                <div className="flex flex-row items-center justify-center py-[9px] lg:flex-col">
                    <div className="text-normal p-1 text-white lg:text-xl">
                        " 방으로 바로 들어가기 "
                    </div>
                    <div className="flex flex-row justify-center text-center font-normal text-white">
                        <div className="p-1 font-bold text-[#FFD600]">15</div>
                        <div className="p-1">
                            초 후에 자동으로 들어갑니다...
                        </div>
                    </div>
                </div>
            </div>
            {/* TODO : 버튼 노란색 부분 구현 필요! */}
            {/* <div className="flex flex-row">
                <button className="flex  items-center justify-center overflow-hidden rounded-br-[30px] rounded-tr-[30px] bg-[#FFD600]/70 ">
                    <IconCheck width="24" height="24" />
                </button>
            </div> */}
        </>
    );
}

export function NewAchievementCard() {
    return (
        <div className="flex items-center justify-between rounded-[30px] bg-black/50 px-8 lg:py-6">
            <div className="flex shrink-0 flex-row items-center justify-center py-[9px] lg:flex-col">
                <div className="p-1 font-normal text-[#FFD600] lg:text-xl">
                    " 게임의 신이 강림했어! "
                </div>
                <div className="flex flex-row justify-center text-center font-normal not-italic leading-[normal] text-white ">
                    <div className="p-1">새로운 </div>
                    <div className="p-1 text-[#FFD600]">[업적]</div>
                    <div className="p-1">획득!</div>
                </div>
            </div>
        </div>
    );
}
export function TrophyCard() {
    return (
        <div className="inline-flex flex-col items-center justify-center gap-[21px] rounded-[30px] bg-white/10 px-4 py-4 shadow-[0px_8px_4px_0px_rgba(0,0,0,0.25)]">
            {/* star icon */}
            <div className="flex items-center gap-[30px] px-20 py-4">
                <div className="h-px w-[75px] bg-white"></div>
                <IconStarFilled width="24" height="24" />
                <div className="h-px w-[75px] bg-white"></div>
            </div>
            {/* trophy image */}
            <Image
                className=""
                src={dummyTrophy.profileImage}
                alt="Trophy"
                width="200"
                height="300"
            />
            <div className="m-6 flex flex-col items-center justify-center rounded-[20px] bg-black/40 px-5 py-6">
                <div className="flex flex-col justify-center text-center text-lg leading-[normal] text-[color:#E7CEFF]">
                    [도움말]
                </div>
                <div className="flex flex-col justify-center pt-2 text-center text-4xl font-bold not-italic leading-[normal] text-[color:#E7CEFF]">
                    업적
                </div>
                <div className="h-[33px] w-[183px] shrink-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="183"
                        height="33"
                        viewBox="0 0 183 33"
                        fill="none"
                    >
                        <line
                            x1="53"
                            y1="18.5"
                            x2="128"
                            y2="18.5"
                            stroke="white"
                        />
                    </svg>
                </div>
                <div className="flex h-[92px] w-[326px] flex-col justify-center text-center text-base font-normal text-white">
                    특정 조건에서 해금되는 업적란! 게임 속 숨겨져 있는 여러
                    업적들을 찾아 깨보세요!! 업적 마스터가 되어보자~!
                </div>
            </div>
        </div>
    );
}
