import Image from "next/image";

const dummyData = {
    name: "Cat, Nate the great",
    explanation: "설명이 들어갈 자리입니다~!",
};

export default function CharacterSelector() {
    return (
        <div className=" flex flex-row items-center justify-end gap-3 self-stretch rounded-[32px] bg-white/30 px-4 py-3 shadow-[0px_8px_4px_0px_rgba(0,0,0,0.25)]">
            {/* left part */}
            {/* NOTE: WIP!!!!! 안쪼그라드게 만들기!! */}
            <div className="flex flex-col">
                <div className="flex h-[20px] flex-row items-center text-sm">
                    <div className="text-[#FFD600]">플레이 할 캐릭터</div>
                    <div className="text-white">를 선택하세요!</div>
                </div>
                <Image
                    className=""
                    src={"/jisookim.png"}
                    alt="playerSelector"
                    width="200"
                    height="200"
                />
            </div>
            {/* right part */}
            <div className="flex shrink-0 flex-col items-center justify-center gap-4 self-stretch px-4 pb-1 pt-8">
                <div className="flex flex-col justify-center text-center text-xl font-bold uppercase italic leading-[normal] text-white">
                    {dummyData.name}
                </div>
                <div className=" text-center text-base font-bold not-italic leading-[normal] text-white">
                    {dummyData.explanation}
                </div>
                <div className="h-px "></div>
                <div className="flex flex-col justify-center text-center text-base font-bold italic leading-[normal] text-[#FFD600]">
                    select the character below!
                </div>
                {/* {character bar} */}
            </div>
        </div>
    );
}
