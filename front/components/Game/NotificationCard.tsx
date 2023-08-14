import { IconCheck } from "@/components/ImageLibrary";

export function ClikNotificationCard() {
    return (
        <div className="p-[71px 0px] flex h-[125px] w-[390px] items-center justify-between rounded-[30px] bg-black/50 px-0 shadow-[0px_8px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="flex w-[300px] shrink-0 flex-col items-center justify-center px-0 py-[9px]">
                <div className="p-1 text-xl text-white">
                    방으로 바로 들어가기
                </div>
                <div className="flex h-[22px] w-[257px] flex-row justify-center text-center font-normal not-italic leading-[normal] text-white">
                    <div className="p-1 font-bold text-[#FFD600]">15</div>
                    <div className="p-1">초 후에 자동으로 들어갑니다...</div>
                </div>
            </div>
            <button className="flex h-[125px] w-[80px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-br-[30px] rounded-tr-[30px] bg-[#FFD600]/70 px-0 ">
                <IconCheck width="24" height="24" />
            </button>
        </div>
    );
}

export default function GameAchievementCard() {
    return (
        <div className="flex h-[125px] w-[300px] items-center justify-between rounded-[30px] bg-black/50 px-0 shadow-[0px_8px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="flex w-[300px] shrink-0 flex-col items-center justify-center px-0 py-[9px]">
                <div className="p-1 text-xl text-[#FFD600]">
                    게임의 신이 강림했어!
                </div>
                <div className="flex h-[22px] w-[257px] flex-row justify-center text-center font-normal not-italic leading-[normal] text-white">
                    <div className="p-1">새로운 </div>
                    <div className="p-1 text-[#FFD600]">[업적]</div>
                    <div className="p-1">획득!</div>
                </div>
            </div>
        </div>
    );
}
