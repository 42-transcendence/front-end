import { usePublicProfile } from "@hooks/useProfile";
import { Avatar } from "../Avatar/Avatar";
import Image from "next/image";
import { NickBlock } from "@components/ProfileItem/ProfileItem";

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

export default function GameUserProfile({
    accountUUID,
}: {
    accountUUID: string;
}) {
    return (
        <div className="flex items-center justify-center gap-4">
            <Avatar
                accountUUID={accountUUID}
                className="relative h-9 w-9 bg-white/30 2xl:h-12 2xl:w-12"
                privileged={false}
            />
            <div className="flex h-[67px] shrink-0 flex-col justify-center text-center text-2xl font-bold not-italic leading-[normal] text-white">
                <NickBlock accountUUID={accountUUID} />
            </div>
        </div>
    );
}
