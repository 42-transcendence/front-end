"use client";
import React from "react";
import { Icon } from "../Icon/Icon";
import Image from "next/image";
import { useState } from "react";

type AvatarProp = {
    profileImage: string;
    userStatus:
        | "online"
        | "invisible"
        | "offline"
        | "idle"
        | "matching"
        | "do-not-disturb"
        | "in-game";
};

const dummyAvatar: AvatarProp = {
    profileImage: "/jisookim.png",
    userStatus: "in-game",
};

export default function ChatRoomBlock() {
    const [messageCount, setMessageCount] = useState(1);

    function addMessageCount() {
        setMessageCount(messageCount + 1);
    }

    return (
        <>
            {/* for spacing */}
            <div className="invisible flex border-4"></div>

            {/* chatrooms - image */}
            <div className="flex h-fit shrink-0 items-center gap-4 self-stretch overflow-hidden">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                        <Image
                            className=""
                            src={dummyAvatar.profileImage}
                            alt="Avatar"
                            width="43"
                            height="43"
                        />
                    </div>
                </div>

                {/* chatrooms - info */}
                <div className="flex h-16 flex-[1_0_0] items-center justify-between overflow-hidden py-2 pl-0 pr-3">
                    <div className="flex flex-col items-start">
                        <div className="inilne-block text-sans h-4 text-ellipsis text-[17px] font-normal not-italic leading-6 text-[color:var(--labels-primary-dark,#FFF)]">
                            <span className="pr-2">Title!</span>
                            <span className="top-[2.5px]e absolute items-center space-x-1">
                                <Icon
                                    className="inline-block "
                                    type="lock"
                                    size={20}
                                />
                                <span className="text-sans overflow-hidden text-ellipsis text-[13px] font-normal not-italic leading-[19px] text-[color:var(--text-tertiary,rgba(255,255,255,0.11))]">
                                    4
                                </span>
                            </span>
                        </div>

                        <div className="text-sans h-8 max-w-[160px] overflow-hidden truncate text-[13px] font-normal not-italic text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                            돈까스가 먹고싶어요 맛있는 돈까스 등심돈까스
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 self-stretch">
                        <div className="text-sans overflow-hidden text-ellipsis text-right text-[13px] font-normal not-italic leading-[18px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                            12월 30일
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-[100px] bg-red-500 p-0.5 px-1">
                            <div className="flex text-center text-[12px] text-base font-thin not-italic leading-[normal] text-white ">
                                {/* 숫자 많으면 +로 바뀌도록 처리하기 (아주 나중이 될듯 ㅋㅋ api언제만듬~~) */}
                                999+
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}