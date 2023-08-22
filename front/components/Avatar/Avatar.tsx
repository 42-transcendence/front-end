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

// TODO: LoadingAvatar, UserAvatar showStatus 부분 로직이 겹치는데 어떻게 할것인가
function LoadingAvatar({ showStatus }: { showStatus: boolean }) {
    return (
        <>
            <Image
                className="relative rounded-full"
                src={"/jisookim.png"} // TODO: loading시에 기본으로 보여줄 회색 사람형상..??
                alt="Avatar"
                fill={true} // TODO: fill / size options?
            />
            {showStatus && (
                <div
                    className={`absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full`}
                >
                    <Status type="offline" />
                </div>
            )}
        </>
    );
}

async function UserAvatar({
    accountUUID,
    showStatus,
}: {
    accountUUID: string;
    showStatus: boolean;
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
            {showStatus && (
                <div
                    className={`absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full`}
                >
                    <Status type={status} />
                </div>
            )}
        </>
    );
}

// TODO: Suspense 비정상적으로 오래 걸리는 이유 확인
//      현재, Avatar 는 React.Suspense를 포함하는 서버 컴포넌트.
//      그러나 클라이언트 컴포넌트인 ChatLeftSideBar에서 이를 import해서 사용.
//      결국 async client component로 쓰이면서 문제가 될 수 있음.
//      혹은 suspense waterfall의 가능성
export function Avatar({
    className,
    accountUUID,
    showStatus, // TODO: refactor
}: {
    className: string;
    accountUUID: string;
    showStatus: boolean;
}) {
    return (
        <div
            className={`${className} flex aspect-square items-start gap-2.5 rounded-full`}
        >
            <Suspense fallback={<LoadingAvatar showStatus={showStatus} />}>
                <UserAvatar accountUUID={accountUUID} showStatus={showStatus} />
            </Suspense>
        </div>
    );
}
