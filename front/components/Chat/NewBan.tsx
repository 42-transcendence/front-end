import { ProfileItemBase } from "../ProfileItem/ProfileItembase";

const configMockup = {
    id: 123,
    uuid: "123",
    tag: "#123",
    name: "hdoo",
    statusMessage: "nothion",
};

export function AccessBan({ uuid }: { uuid: string }) {
    //TODO; fetch from uuid
    void uuid;

    return (
        <div className="flex h-full w-full flex-col justify-start">
            <p className="w-fit text-sm font-bold text-gray-100">
                다음 유저를 현재 채팅방에서 내보냅니다.
            </p>
            <ProfileItemBase className="" />
        </div>
    );
}
