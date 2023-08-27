import { Avatar } from "@/components/Avatar";
import { IconCheck, IconPlus } from "@/components/ImageLibrary";

type Relationship = "myself" | "friend" | "stranger";

export function ProfileSection() {
    //TODO: get info from accountUUID
    const profileInfo = {
        nick: "hdoo",
        tag: "#1234",
        relationship: "myself",
    } as const

    return (
        <div className="h-20 w-full bg-windowGlass/30 p-4 lg:h-full lg:w-48">
            <div className="flex w-full flex-row items-center justify-between gap-4 lg:flex-col">
                <div className="flex h-full w-full flex-row justify-start gap-4 lg:flex-col">
                    <Avatar
                        className="relative h-12 w-12 bg-white/30 lg:h-32 lg:w-32"
                        size={""}
                    />
                    <div className="flex w-full flex-col items-start justify-center text-base md:text-lg lg:text-xl">
                        <h1>{profileInfo.nick}</h1>
                        <h2 className="text-xs text-gray-300/70 md:text-sm lg:text-base">
                            {profileInfo.tag}
                        </h2>
                    </div>
                </div>
                <ProfileButton relationship={profileInfo.relationship} />
            </div>
        </div>
    );
}

function ProfileButton({ relationship }: { relationship: Relationship }) {
    switch (relationship) {
        case "myself":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-secondary p-2 lg:w-full">
                    <span className="text-sm">Edit</span>
                </button>
            );
        case "friend":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-green-500 p-2 lg:w-full">
                    <IconCheck width={16} height={16} />
                </button>
            );
        case "stranger":
            return (
                <button className="relative flex h-8 items-center justify-center rounded-xl bg-gray-500 p-2 lg:w-full">
                    <IconPlus width={16} height={16} />
                </button>
            );
    }
}
