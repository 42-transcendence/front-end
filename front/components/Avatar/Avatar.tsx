import { Suspense } from "react";
import { Status } from "@/components/Status";
import type { StatusType } from "@/components/Status";
import Image from "next/image";

async function getUserStatus(
    accountUUID: string,
): Promise<{ avatarKey: string; status: StatusType }> {
    // TODO: dummy async function to make getUserStatus as a async function.
    //       delete later
    await new Promise((r) => setTimeout(r, 1));

    // const avatarKey = "jisookim"; //FIXME: temporary
    // const status = "online"; //FIXME: temporary
    return {
        avatarKey: "jisookim",
        status: "online",
    };
}

function LoadingAvatar() {
    return (
        <>
            <Image
                className="relative rounded-full"
                src={"/jisookim.png"} // TODO: loading시에 기본으로 보여줄 회색 사람형상..??
                alt="Avatar"
                fill={true} // TODO: fill / size options?
            />
            <div
                className={`absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full`}
            >
                <Status type="offline" />
            </div>
        </>
    );
}

async function UserAvatar({
    accountUUID,
}: {
    accountUUID: string;
}) {
    //TODO: fetch Avatar datas
    // \-  get user profile and status from accountid

    const { avatarKey, status } = await getUserStatus(accountUUID);

    return (
        <>
            <Image
                className="relative rounded-full"
                src={`/${avatarKey}.png`}
                alt="Avatar"
                fill={true} // TODO: fill / size options?
            />
            <div
                className={`absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full`}
            >
                <Status type={status} />
            </div>
        </>
    );
}

export function Avatar({
    className,
    accountUUID,
}: {
    className: string;
    accountUUID: string;
}) {

    return (
        <div
            className={`${className} flex aspect-square items-start gap-2.5 rounded-full`}
        >
            <Suspense fallback={<LoadingAvatar />}>
                <UserAvatar accountUUID={accountUUID} />
            </Suspense>
        </div>
    );
}
