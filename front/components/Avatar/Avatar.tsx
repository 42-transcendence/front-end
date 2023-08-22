import { Suspense } from "react";
import { Status } from "@/components/Status";
import Image from "next/image";
import { cookies } from "next/headers";
import {
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@/library/payload/profile-payloads";
import { ActiveStatusNumber } from "@/library/generated/types";

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
                    <Status type={ActiveStatusNumber.OFFLINE} />
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

    const url = new URL("https://back.stri.dev/profile/public");
    url.searchParams.set("uuid", accountUUID);
    const { avatarKey } = (await fetch(url, {
        headers: {
            Authorization: ["Bearer", cookies().get("at")].join(" "),
        },
    }).then((e) => e.json())) as AccountProfilePublicPayload; //FIXME: 살려줘!! 도와줘!!

    const urlProtected = new URL("https://back.stri.dev/profile/protected");
    urlProtected.searchParams.set("uuid", accountUUID);
    const { activeStatus } = (await fetch(urlProtected, {
        headers: {
            Authorization: ["Bearer", cookies().get("at")].join(" "),
        },
    }).then((e) => e.json())) as AccountProfileProtectedPayload; //FIXME: 살려줘!! 도와줘!!

    return (
        <>
            <Image
                className="relative rounded-full"
                src={`/${avatarKey}.png`}
                alt="Avatar"
                fill={true} // TODO: fill / size options?
            />
            {showStatus && (
                <div className="absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full">
                    <Status type={activeStatus} />
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
