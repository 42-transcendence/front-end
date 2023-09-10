import { Avatar } from "@components/Avatar";
import { useProtectedProfile } from "@hooks/useProfile";

export function ProfileItemBase({
    className,
    accountUUID,
}: {
    className?: string | undefined;
    accountUUID: string;
}) {
    const profile = useProtectedProfile(accountUUID);

    return (
        <div
            className={`relative flex h-fit w-full shrink-0 flex-col items-start rounded bg-windowGlass/30 p-2 ${className} `}
        >
            <div className="group relative flex w-full flex-row items-center self-stretch ">
                <div className="disable-select relative flex items-center gap-2 space-x-4 ">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className="w-6 p-2"
                            accountUUID={accountUUID}
                            privileged={true}
                        />
                    </div>
                    <div className="relative flex w-fit flex-row items-center justify-center gap-3">
                        <p className="relative w-fit whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {profile?.nickName}
                        </p>
                        <p className="relative w-fit whitespace-nowrap font-sans text-xs font-normal leading-none tracking-normal text-gray-300/60">
                            #{profile?.nickTag}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
