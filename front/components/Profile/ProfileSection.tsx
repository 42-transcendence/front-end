import { Avatar } from "@/components/Avatar";
import { IconCheck, IconPlus } from "@/components/ImageLibrary";

type Relationship = "myself" | "friend" | "stranger";

export function ProfileSection() {
    //TODO: get nick from accountUUID const nick = "hdoo";
    const nick = "hdoo";
    //TODO: get tag from accountUUID
    const tag = "#1234";
    //TODO: get relationship from accountUUID const relationship: Relationship = "stranger";
    const relationship = "myself";

    return (
        <div className="h-20 w-full bg-windowGlass/30 p-4 2xl:h-full 2xl:w-48">
            <div className="flex w-full flex-row items-center justify-between gap-4 2xl:flex-col">
                <div className="flex h-full w-full flex-row justify-start gap-4 2xl:flex-col">
                    <Avatar
                        className="relative h-12 w-12 bg-white/30 2xl:h-32 2xl:w-32"
                        size={""}
                    />
                    <div className="flex w-full flex-col items-start justify-center text-base md:text-lg 2xl:text-xl">
                        <h1>{nick}</h1>
                        <h2 className="text-xs text-gray-300/70 md:text-sm 2xl:text-base">
                            {tag}
                        </h2>
                    </div>
                </div>
                <ProfileButton relationship={relationship} />
            </div>
        </div>
    );
}

function ProfileButton({ relationship }: { relationship: Relationship }) {
    switch (relationship) {
        case "myself":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-secondary p-2 2xl:w-full">
                    <span className="text-sm">Edit</span>
                </button>
            );
        case "friend":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-green-500 p-2 2xl:w-full">
                    <IconCheck width={16} height={16} />
                </button>
            );
        case "stranger":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-gray-500 p-2 2xl:w-full">
                    <IconPlus width={16} height={16} />
                </button>
            );
    }
}
