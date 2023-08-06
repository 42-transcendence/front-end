import Image from "next/image";

const gameCharacters = [
    {
        name: "cat",
        src: "/jisookim.png",
    },
    {
        name: "golden retriever",
        src: "/jkong.png",
    },
    {
        name: "tibet fox",
        src: "/chanhpar.png",
    },
    {
        name: "gazel",
        src: "/iyun.png",
    },
    {
        name: "shaggy dog",
        src: "/hdoo.png",
    },
];

export function CharacterSelectBar() {
    return (
        <div className="w-30 h-30 box-border flex items-start justify-between rounded-[14px] bg-black/30 p-4">
            {gameCharacters.map((gameCharacter) => (
                <button key={gameCharacter.name} className="m-1">
                    <Image
                        className="box-content bg-black/50"
                        src={gameCharacter.src}
                        alt={gameCharacter.name}
                        width="50"
                        height="50"
                    />
                </button>
            ))}
        </div>
    );
}

const dummyData = {
    name: "Cat, Nate the great",
    explanation:
        "돈까스를 좋아하는 우주고양이. 우주식량 [바삭바삭안심돈까스]의 2번째 버전이 출시되길\
    간절히 바라고 있다. 후드티와 후드집업을 좋아한다!! 여름인데 왜 이렇게 추울까... 너모추워..\
    돈까스 먹고싶다~! 파이팅 파이팅 우리 트센 팀 짱짱",
};

export default function CharacterSelector() {
    return (
        <div className="flex h-[330px] w-[600px] items-center justify-end rounded-[32px] bg-white/30 px-4 py-3 shadow-[0px_8px_4px_0px_rgba(0,0,0,0.25)]">
            {/* left part */}
            {/* NOTE: WIP!!!!! 안쪼그라드게 만들기!! */}

            <div className="m-3 flex-col content-center items-center">
                <div className="">
                    {/* <Icon
                        className="m-2 fill-[#FFD600]"
                        type="filledStar"
                        size={20}
                    /> */}
                    <div className="mx-2 mb-2 flex-row content-center items-center text-sm">
                        <span className="text-[#FFD600]">플레이 할 캐릭터</span>
                        <span className="text-white">를 선택!</span>
                    </div>
                </div>
                <Image
                    className="bg-black"
                    src={"/jisookim.png"}
                    alt="playerSelector"
                    width="200"
                    height="200"
                />
            </div>
            {/* right part */}
            <div className="flex w-[430px] flex-col items-center justify-center gap-4 self-stretch pb-1 pt-4">
                <div className="flex flex-col justify-center text-center text-xl font-bold uppercase italic leading-[normal] text-white">
                    {dummyData.name}
                </div>
                <div className=" w-[310px] text-center text-xs font-bold not-italic leading-[normal] text-white">
                    {dummyData.explanation}
                </div>
                <div className="h-px "></div>
                <div className="flex flex-col justify-center text-center text-base font-bold italic leading-[normal] text-[#FFD600]">
                    select the character below!
                </div>
                {/* {character bar} */}
                <CharacterSelectBar />
            </div>
        </div>
    );
}
