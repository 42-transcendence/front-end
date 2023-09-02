"use client";

import { Status } from "@/components/Status";
import Image from "next/image";
import { ActiveStatusNumber } from "@/library/generated/types";
import { useProtectedProfile, usePublicProfile } from "@/hooks/useProfile";

function PrivilegedSection({ accountUUID }: { accountUUID: string }) {
    const profile = useProtectedProfile(accountUUID);

    return (
        <div className="absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full">
            <Status
                type={profile?.activeStatus ?? ActiveStatusNumber.INVISIBLE}
            />
        </div>
    );
}

const imageLoader = ({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) => {
    void width;
    void quality;
    if (src.startsWith("__DEFAULT__")) {
        // TODO: fallback avatar image
        return `https://www.gravatar.com/avatar/${
            src.split("#")[1]
        }?d=identicon`;
    }

    return `https://back.stri.dev/internal/raw-avatar/${src}?a=AKASHA`;
};

export function Avatar({
    className,
    accountUUID,
    privileged,
}: {
    className: string;
    accountUUID: string;
    privileged: boolean;
}) {
    const profile = usePublicProfile(accountUUID);

    return (
        <div
            className={`${className} flex aspect-square items-start gap-2.5 rounded-full`}
        >
            <Image
                className="relative rounded-full"
                src={profile?.avatarKey ?? `__DEFAULT__#${accountUUID}`}
                alt="Avatar"
                sizes="100%"
                fill={true}
                loader={imageLoader}
            />
            {privileged && <PrivilegedSection accountUUID={accountUUID} />}
        </div>
    );
}
