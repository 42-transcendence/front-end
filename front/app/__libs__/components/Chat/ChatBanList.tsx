import { useState } from "react";
import { ProfileItemBlocked } from "@components/ProfileItem/ProfileItemBlocked";

type BlockedUser = {
    accountUUID: string;
    memo: string;
    expireTimeStamp: Date;
};
const CommitBanList: BlockedUser[] = [
    {
        accountUUID: "123456",
        memo: "그냥",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "47789",
        memo: "그냥2",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "5123",
        memo: "그냥3",
        expireTimeStamp: new Date(),
    },
];

const AccessBanList: BlockedUser[] = [
    {
        accountUUID: "123",
        memo: "그냥",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "4",
        memo: "그냥2",
        expireTimeStamp: new Date(),
    },
    {
        accountUUID: "5",
        memo: "그냥3",
        expireTimeStamp: new Date(),
    },
];

export function ChatAccessBanList() {
    //TODO: add selected onClick logic
    const [selected, setSelected] = useState<number>();

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {AccessBanList.map((user, index) => {
                return (
                    <ProfileItemBlocked
                        key={index}
                        accountUUID={user.accountUUID}
                        selected={selected === index}
                        onClick={() =>
                            setSelected(selected !== index ? index : undefined)
                        }
                    />
                );
            })}
        </div>
    );
}

export function ChatCommitBanList() {
    //TODO: add selected onClick logic
    const [selected, setSelected] = useState<number>();

    return (
        <div className="flex h-fit w-full flex-col gap-2">
            {CommitBanList.map((user, index) => {
                return (
                    <ProfileItemBlocked
                        key={index}
                        accountUUID={user.accountUUID}
                        selected={selected === index}
                        onClick={() =>
                            setSelected(selected !== index ? index : undefined)
                        }
                    />
                );
            })}
        </div>
    );
}
