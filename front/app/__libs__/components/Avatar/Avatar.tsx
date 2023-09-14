"use client";

import { Status } from "@components/Status";
import Image from "next/image";
import { ActiveStatusNumber } from "@common/generated/types";
import { useProtectedProfile, usePublicProfile } from "@hooks/useProfile";
import { HOST } from "@hooks/fetcher";

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
    return `https://${HOST}/internal/raw-avatar/${src}?a=AKASHA`;
};

const defaultImageLoader = ({ src }: { src: string }) =>
    `https://www.gravatar.com/avatar/${src}?d=identicon`;

function AvatarBase({
    className,
    children,
}: React.PropsWithChildren<{ className: string }>) {
    return (
        <div
            className={`${className} flex aspect-square items-start gap-2.5 rounded-full`}
        >
            {children}
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
    const profile = usePublicProfile(accountUUID);

    if (profile === undefined) {
        return <DefaultAvatar className={className} uuid={accountUUID} />;
    }
    return (
        <AvatarBase className={className}>
            {profile.avatarKey !== null ? (
                <Image
                    className="relative rounded-full"
                    src={profile.avatarKey}
                    alt="Avatar"
                    sizes="100%"
                    fill={true}
                    loader={imageLoader}
                />
            ) : (
                <Image
                    className="relative rounded-full"
                    src={accountUUID}
                    alt="Avatar"
                    sizes="100%"
                    fill={true}
                    loader={defaultImageLoader}
                />
            )}
            {privileged && <PrivilegedSection accountUUID={accountUUID} />}
        </AvatarBase>
    );
}

export function DefaultAvatar({
    className,
    uuid,
}: {
    className: string;
    uuid: string;
}) {
    return (
        <AvatarBase className={className}>
            <Image
                className="relative rounded-full"
                src={uuid}
                alt="Avatar"
                sizes="100%"
                fill={true}
                loader={defaultImageLoader}
            />
        </AvatarBase>
    );
}
