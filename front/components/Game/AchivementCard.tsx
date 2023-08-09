import { Icon } from "@/components/Icon/Icon";
import Image from "next/image";

type TrophyImages = {
    profileImage: string;
    type: "bronze" | "gold" | "ruby" | "platinum";
};

const dummyTrophy: TrophyImages = {
    profileImage: "/skin-platinum.png",
    type: "platinum",
};

export default function AchivementCard() {
    return (
        <div className="AchivementCardBackground">
            {/* star icon */}
            <div className="flex items-center gap-[30px] px-20 py-4">
                <div className="h-px w-[75px] bg-white"></div>
                <Icon type="filledStar" size={40} className="" />
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
            <div className="AchivementCardExplainBox">
                <div className="AchivementCardSubTitle">[도움말]</div>
                <div className="AchivementCardTitle">업적</div>
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
                <div className="AchivementCardContent">
                    특정 조건에서 해금되는 업적란! 게임 속 숨겨져 있는 여러
                    업적들을 찾아 깨보세요!! 업적 마스터가 되어보자~!
                </div>
            </div>
        </div>
    );
}
