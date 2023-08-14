
export function GameUserRoundScore() {
    return (
        <div className="m-1 flex flex-row items-stretch justify-between gap-2.5 rounded-[15px] bg-black/30 px-5 py-[15px]">
            <div className="flex w-[120px]  flex-col justify-center text-center text-2xl font-bold italic leading-[normal] text-[color:#B061FF]">
                ROUND 1
            </div>
            <div className="h-[27px] w-1 shrink-0 bg-slate-100"></div>
            <div className="flex w-[80px] justify-center text-center text-2xl font-bold italic leading-[normal] text-white">
                {/* 점수 */}3
            </div>
        </div>
    );
}
