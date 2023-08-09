import { Avatar } from "../Avatar/Avatar";
import Image from "next/image";

export function GameChipStatusNotYet() {
    return (
        <div className="flex flex-col justify-center rounded-xl  bg-black/60 px-[10px] py-[2px] text-center text-lg font-bold italic leading-[normal] text-white">
            NOT YET
        </div>
    );
}

export function GameChipStatusReady() {
    return (
        <div className="flex flex-col justify-center rounded-xl  bg-[#FF8A00] px-[10px] py-[2px] text-center text-lg font-bold italic leading-[normal] text-white">
            READY!!
        </div>
    );
}

export function GameChipProfile() {
    return (
        <div className="flex shrink-0 flex-col items-center justify-between">
            <Image
                className=""
                src={"/game/game-chip-1_dummy.png"}
                alt="character_chip"
                width="150"
                height="100"
            />
            <div className="flex flex-col justify-center pb-3 italic text-white">
                jisookim
            </div>
            <div className="flex items-center justify-center">
                {/* GameChipStatusNotYet ||  GameChipStatusReady */}
                <GameChipStatusReady />
            </div>
        </div>
    );
}

// 게임 끝나고 나오는 검은색 점수창. 라운드마다 몇 골을 넣었는지, 최종점수가 어떻게 되는지 확인 할 수 있다.
export default function GameUserProfile() {
    return (
        <div className="flex w-[239px] items-center justify-center gap-[22px] py-7">
            <Avatar size={"w-12"} accountId={1} className={"fill-ultraDark"} />
            <div className="flex h-[67px] shrink-0 flex-col justify-center text-center text-2xl font-bold not-italic leading-[normal] text-white">
                hdoo
            </div>
        </div>
    );
}
