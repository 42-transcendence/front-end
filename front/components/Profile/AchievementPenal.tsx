import Image from "next/image";
import { Panel } from "./Panel";
import { useState } from "react";
import { IconMagicCirclesingleBorder } from "../ImageLibrary";

type Achievement = {
    id: number;
    grade: Grade;
    title: string;
    content: string;
};

const achievementList: Achievement[] = [
    {
        id: 1,
        grade: "platinum",
        title: "게임의 신이 강림했어!",
        content: " 3번 연속 골을 성공하면 얻을 수 있는 업적입니다.",
    },
    {
        id: 2,
        grade: "bronze",
        title: "첫 승리!",
        content: "처음으로 게임에서 이기면 얻을 수 있는 업적입니다.",
    },
    {
        id: 3,
        grade: "platinum",
        title: "뭐야, 이건 마법인가요?!",
        content:
            "10번 연속 골을 성공하면 얻을 수 있는 업적입니다. 어떻게 이런 걸 하시는 거에요? 당신은 마술사인가요?!",
    },
    {
        id: 4,
        grade: "platinum",
        title: "100회 승리 클럽 가입",
        content: "총 100번의 승리를 달성하면 얻을 수 있는 업적입니다.",
    },
    {
        id: 5,
        grade: "platinum",
        title: "무적의 플레이어",
        content: "5번 연속 게임에서 이기면 얻을 수 있는 업적입니다.",
    },
    {
        id: 6,
        grade: "gold",
        title: "끈기의 상징",
        content:
            "10번 연속 패배 후 승리하면 얻을 수 있는 업적입니다. 포기하지 않는 정신을 상징합니다.",
    },
    {
        id: 7,
        grade: "platinum",
        title: "하하, 이런 것도 가능한가봐요!",
        content:
            "패들의 모서리를 이용해 10번 연속 골을 방어하면 얻을 수 있는 업적입니다. 이런 스킬을 보여주다니, 정말 대단해요!",
    },
    {
        id: 8,
        grade: "gold",
        title: "천리안 수호자",
        content:
            "게임 당 평균 골 방어율이 80% 이상일 때 얻을 수 있는 업적입니다.",
    },
    {
        id: 9,
        grade: "platinum",
        title: "방어의 전설",
        content: "한 게임에서 20번 연속 골을 방어하면 얻을 수 있는 업적입니다.",
    },
    {
        id: 10,
        grade: "bronze",
        title: "렐리의 시작",
        content:
            "한 게임 내에서 10번의 렐리를 성공하면 얻을 수 있는 업적입니다.",
    },
    {
        id: 11,
        grade: "silver",
        title: "렐리 마스터",
        content:
            "한 렐리에서 20번 이상의 공교환을 성공하면 얻을 수 있는 업적입니다. 연속 렐리!",
    },
    {
        id: 12,
        grade: "silver",
        title: "끝나지 않는 대결",
        content:
            "한 게임에서 5번의 렐리에서 15번 이상 공교환을 성공하면 얻을 수 있는 업적입니다.",
    },
    {
        id: 13,
        grade: "gold",
        title: "렐리의 왕",
        content:
            "한 게임에서 총 50번의 렐리를 성공하면 얻을 수 있는 업적입니다.",
    },
    {
        id: 14,
        grade: "platinum",
        title: "전설의 렐리",
        content:
            "한 렐리에서 50번 이상의 공교환을 성공하면 얻을 수 있는 업적입니다. 이것은 진정한 렐리의 신화!",
    },
    {
        id: 15,
        grade: "platinum",
        title: "렐리의 철학자",
        content:
            "연속 10번의 렐리에서 10번 이상 공교환을 성공하면 얻을 수 있는 업적입니다.",
    },
];

type Grade = "bronze" | "silver" | "gold" | "platinum";

function AchievementItem({
    achievementID,
    accomplished,
}: {
    achievementID: number;
    accomplished: boolean;
}) {
    const [opened, setOpened] = useState(false);
    //TODO: get state from server
    const achievement = achievementList[achievementID];
    const grade = achievement.grade;

    const trophy = () => {
        switch (grade) {
            case "bronze":
                return "/game/skin-bronze.png";
            case "silver":
                return "/game/skin-silver.png";
            case "gold":
                return "/game/skin-gold.png";
            case "platinum":
                return "/game/skin-platinum.png";
        }
    };

    const titleColor = () => {
        switch (grade) {
            case "bronze":
                return "text-amber-500/70";
            case "silver":
                return "text-blue-100/90";
            case "gold":
                return "text-tertiary/90";
            case "platinum":
                return "text-transparent bg-clip-text bg-gradient-to-br from-secondary via-purple-500 to-pink-500 ";
        }
    };

    const state = accomplished ? "달성" : "1 / 3";
    //TODO: get date from backend
    const date = new Date();

    return (
        <div
            className={`relative flex w-full shrink-0 overflow-clip rounded-xl bg-black/30  hover:bg-black/20 active:bg-black/10`}
        >
            <input
                id="AchievementItem"
                type="checkbox"
                checked={opened}
                className="hidden"
            />
            <label
                htmlFor="AchievementItem"
                data-opened={opened}
                onClick={() => setOpened(!opened)}
                className="flex flex-row gap-4 justify-between items-center w-full group"
            >
                <div className={`w-full p-4`}>
                    <div
                        className={`relative flex flex-row items-center justify-center gap-4`}
                    >
                        <div
                            className={`h-8 w-5 items-center justify-center ${
                                accomplished ? "" : "peer opacity-50 grayscale"
                            }`}
                        >
                            <Image
                                src={trophy()}
                                width={18}
                                height={32}
                                alt={grade}
                                title={grade}
                            />
                        </div>
                        <div className="flex flex-col gap-1 justify-start items-start w-full">
                            <span
                                className={`${
                                    accomplished
                                        ? titleColor()
                                        : "text-gray-300/70"
                                }  line-clamp-1 text-sm group-data-[opened=true]:line-clamp-none md:text-base 2xl:text-xl`}
                            >
                                {achievement.title}
                            </span>
                            <span className="line-clamp-1 break-words text-xs font-normal text-gray-100/80 group-data-[opened=true]:line-clamp-none md:text-sm 2xl:text-base">
                                {achievement.content}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex relative flex-col gap-1 justify-center items-center w-20 min-h-full shrink-0 overflow-clip bg-black/30">
                    <span className="">{state}</span>
                    {accomplished && (
                        <>
                            <IconMagicCirclesingleBorder
                                className="absolute top-0 -left-3 text-white/10"
                                width="144%"
                                height="144%"
                            />
                            <span className="px-1 text-xs rounded-lg bg-black/80 text-gray-100/70">
                                {date.toLocaleDateString()}
                            </span>
                        </>
                    )}
                </div>
            </label>
        </div>
    );
}

//TODO: remove later
const achievementMockup = [
    {
        id: 1,
        accomplished: true,
    },
    {
        id: 2,
        accomplished: false,
    },
    {
        id: 6,
        accomplished: true,
    },
    {
        id: 11,
        accomplished: true,
    },
    {
        id: 5,
        accomplished: true,
    },
    {
        id: 7,
        accomplished: false,
    },
];

export function AchievementPenal({ accountUUID }: { accountUUID: string }) {
    // TODO: get from accountUUID
    void accountUUID;
    const achievementList = achievementMockup;

    return (
        <Panel
            className={
                "flex flex-col items-start justify-start overflow-clip md:col-span-2 md:row-span-1"
            }
        >
            <span className="p-4 text-xl font-extrabold text-white">업적</span>
            <div className="flex overflow-auto flex-col gap-2 w-full">
                {achievementList.map((ach, index) => (
                    <AchievementItem
                        key={index}
                        achievementID={ach.id}
                        accomplished={ach.accomplished}
                    />
                ))}
            </div>
        </Panel>
    );
}
