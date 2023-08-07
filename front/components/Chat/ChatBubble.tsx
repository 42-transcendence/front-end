// import { useState } from "react";
import { Avatar } from "../Avatar";
import ChatBubbleTail from "/public/chat_bubble_tail.svg";
import ChatBubbleTailRight from "/public/chat_bubble_tail_right.svg";

type UUID = string

export type ChatMessageType = {
    msgId: bigint,
    content: string,
    timestamp: Date,
    sender: UUID, // TODO
}

export function ChatBubbleWithProfile({
    chatMessage,
    isContinued,
    dir,
}: {
    chatMessage: ChatMessageType;
    isContinued: boolean;
    dir?: "left" | "right";
}) {
    //TODO: apply direction
    //TODO: hide username, tail, profile when message is continued

    const hidden = isContinued ? "hidden" : "";
    return (
        <div className={`relative flex shrink flex-row pl-16 pt-6`}>
            {/* TODO: get avatar from sender info */}
            <Avatar
                className={`${hidden}  absolute left-0 top-0`}
                size={"w-12 h-12"}
                accountId={1}
            />
            <div
                className={`${hidden} absolute -top-1 left-16 font-sans text-lg font-normal text-white `}
            >
                { // account.username
                    chatMessage.sender
                }
            </div>
            <ChatBubble> {chatMessage.content} </ChatBubble>
        </div>
    );
}

export function ChatBubble({ children }: React.PropsWithChildren) {
    return (
        <div className="relative flex h-fit w-full flex-row pl-[11px] pt-[5px]">
            <ChatBubbleTail
                width="24"
                height="13"
                className="absolute left-0 top-0 text-primary"
            />
            <div className="static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs whitespace-normal rounded-xl bg-primary p-3 font-sans text-base font-normal text-gray-100/90">
                {children}
            </div>
        </div>
    );
}

export function ChatBubbleRight({ children }: React.PropsWithChildren) {
    return (
        <div className="relative flex h-fit w-full flex-row-reverse pr-[11px] pt-[5px]">
            <ChatBubbleTailRight
                width="24"
                height="13"
                className="absolute right-0 top-0 text-secondary"
            />
            <div className="static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs whitespace-normal rounded-xl bg-secondary p-3 font-sans text-base font-normal text-gray-100/90">
                {children}
                asdf
            </div>
        </div>
    );
}
