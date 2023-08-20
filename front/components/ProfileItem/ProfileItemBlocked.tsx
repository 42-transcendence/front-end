import React, { MouseEventHandler } from "react";
import { Avatar } from "@/components/Avatar";

export function ProfileItemBlocked({
    className,
    selected,
    accountUUID,
    children,
    onClick,
}: {
    className?: string | undefined;
    accountUUID: string;
    selected: boolean;
    children?: React.ReactNode | undefined;
    onClick: MouseEventHandler;
}) {
    //TODO: get nick from accountUUID by fetch
    const nickName = "fallback";
    const memo = "memomemo";
    const date = "2023. 8. 29.";

    return (
        <li
            className={` relative flex h-fit w-full shrink-0 flex-col items-start ${className}`}
        >
            <div className="relative flex flex-col items-start self-stretch rounded ">
                <div
                    onClick={onClick}
                    className="group/profile relative flex w-full select-none items-center gap-4 rounded p-2 hover:bg-primary/30"
                >
                    <div className="relative flex items-center justify-center">
                        <Avatar accountUUID={accountUUID} className="w-6" />
                    </div>
                    <div className="w-full overflow-hidden">
                        <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 transition-all ease-linear group-hover/profile:-translate-x-[150%] group-hover/profile:overflow-visible group-hover/profile:delay-300 group-hover/profile:duration-[5000ms]">
                            {children ?? nickName}
                        </div>
                    </div>
                </div>
                {selected ? (
                    <div className="flex w-full flex-col gap-2 p-2">
                        <div className="flex w-full flex-col rounded px-2">
                            <span className="text-gray-50">차단 사유</span>
                            {memo}
                            <span className="text-gray-50">기간</span>
                            {date}
                        </div>
                        <button
                            onClick={
                                (event) =>
                                    event.preventDefault() /*TODO: remove user from blocked list */
                            }
                            className="w-full rounded bg-red-500 p-2 text-sm"
                        >
                            차단 해제하기
                        </button>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </li>
    );
}
