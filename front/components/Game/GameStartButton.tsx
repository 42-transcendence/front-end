import Image from "next/image";

const dummydata = {
    notYetPlayer: "1",
};

export default function GameStartButton() {
    return (
        <button>
            <div className=" flex h-[330px] w-[268px] flex-col justify-center gap-2.5 rounded-[32px] bg-black/30 px-9 py-[50px] text-center shadow-[0px_8px_4px_0px_rgba(0,0,0,0.25)]">
                <Image
                    className=" h-[162px] w-[268px] fill-white"
                    src={"/gamestart.svg"}
                    alt="GamestartButton"
                    width="200"
                    height="200"
                />
                <div className="justify-center text-center text-base font-bold uppercase not-italic leading-[normal] text-white">
                    게임 시작하기!
                </div>
                <div className="m-2 justify-center text-center text-xs">
                    <span className="text-[#FFD600]">
                        {dummydata.notYetPlayer}
                    </span>
                    <span className="text-white">
                        명의 대기인원 기다리는중...
                    </span>
                </div>
            </div>
        </button>
    );
}
