"use client";

import { Status } from "@/components/Status";
import Image from "next/image";
import {
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@/library/payload/profile-payloads";
import { ActiveStatusNumber } from "@/library/generated/types";
import { fetcher, useSWR } from "@/hooks/fetcher";

function PrivilegedAvatar({ accountUUID }: { accountUUID: string }) {
    const { data } = useSWR(
        `/profile/protected/${accountUUID}`,
        fetcher<AccountProfileProtectedPayload>,
    );

    return (
        <div className="absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full">
            <Status type={data?.activeStatus ?? ActiveStatusNumber.INVISIBLE} />
        </div>
    );
}

export function Avatar({
    className,
    accountUUID,
    privileged,
}: {
    className: string;
    accountUUID: string;
    privileged: boolean;
}) {
    const { data } = useSWR(
        `/profile/public/${accountUUID}`,
        fetcher<AccountProfilePublicPayload>,
    );

    return (
        <div
            className={`${className} flex aspect-square items-start gap-2.5 rounded-full`}
        >
            <Image
                className="relative rounded-full"
                src={data?.avatarKey ?? "/jkong.png"}
                alt="Avatar"
                fill={true} // TODO: fill / size options?
            />
            {privileged && <PrivilegedAvatar accountUUID={accountUUID} />}
        </div>
    );
}
