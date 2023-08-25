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
        <div className="p-4 w-full h-20 lg:w-48 lg:h-full bg-windowGlass/30">
            <div className="flex flex-row gap-4 justify-between items-center w-full lg:flex-col">
                <div className="flex flex-row gap-4 justify-start w-full h-full lg:flex-col">
                    <Avatar
                        className="relative w-12 h-12 lg:w-32 lg:h-32 bg-white/30"
                        size={""}
                    />
                    <div className="flex flex-col justify-center items-start w-full text-base md:text-lg lg:text-xl">
                        <h1>{nick}</h1>
                        <h2 className="text-xs md:text-sm lg:text-base text-gray-300/70">
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
                <button className="flex relative justify-center items-center p-2 h-8 rounded-xl lg:w-full bg-secondary">
                    <span className="text-sm">Edit</span>
                </button>
            );
        case "friend":
            return (
                <button className="flex relative justify-center items-center p-2 h-8 bg-green-500 rounded-xl lg:w-full">
                    <IconCheck width={16} height={16} />
                </button>
            );
        case "stranger":
            return (
                <button className="flex relative justify-center items-center p-2 h-8 bg-gray-500 rounded-xl lg:w-full">
                    <IconPlus width={16} height={16} />
                </button>
            );
    }
}
