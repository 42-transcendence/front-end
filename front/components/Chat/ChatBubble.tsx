// import { useState } from "react";
import { ChatMessageEntry } from "@/library/payload/chat-payloads";
import { Avatar } from "../Avatar";
import { Chat } from "@/components/ImageLibrary";

export function ChatBubbleWithProfile({
    chatMessage,
    isContinued = false,
    dir = "left",
}: {
    chatMessage: ChatMessageEntry;
    isContinued: boolean;
    dir: "left" | "right";
}) {
    //TODO: apply direction
    //TODO: hide username, tail, profile when message is continued

    const hidden = dir === "right" || isContinued ? "hidden" : "";
    return (
        <div
            className={`relative flex shrink flex-row pl-16 ${
                isContinued ? "pt-0" : "pt-6"
            }`}
        >
            {/* TODO: get avatar from sender info */}
            <Avatar
                className={`${hidden} absolute left-0 top-0 h-12 w-12`}
                accountUUID={chatMessage.memberUUID}
                privileged={false}
            />
            <div
                className={`${hidden} absolute -top-1 left-16 font-sans text-lg font-normal text-white `}
            >
                {
                    // TODO: fetch name from uuid
                    chatMessage.memberUUID
                }
            </div>
            <ChatBubble isContinued={isContinued} dir={dir}>
                {chatMessage.content}
            </ChatBubble>
        </div>
    );
}

function ChatBubble({
    children,
    isContinued,
    dir,
}: React.PropsWithChildren<{
    isContinued: boolean;
    dir: "left" | "right";
}>) {
    const styleOption =
        dir === "left"
            ? {
                  flexDirection: "flex-row",
                  padding: "pl-[11px] pt-[5px]",
                  bgColor: "bg-primary",
                  tail: (
                      <Chat.BubbleTailLeft
                          width="24"
                          height="13"
                          className="absolute left-0 top-0 text-primary"
                      />
                  ),
              }
            : {
                  flexDirection: "flex-row-reverse",
                  padding: "pr-[11px] pt-[5px]",
                  bgColor: "bg-secondary",
                  tail: (
                      <Chat.BubbleTailRight
                          width="24"
                          height="13"
                          className="absolute right-0 top-0 text-secondary"
                      />
                  ),
              };

    return (
        <div
            className={`relative flex h-fit w-full ${styleOption.flexDirection} ${styleOption.padding}`}
        >
            {!isContinued && styleOption.tail}
            <div
                className={`static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs whitespace-normal rounded-xl ${styleOption.bgColor} p-3 font-sans text-base font-normal text-gray-100/90`}
            >
                {children}
            </div>
        </div>
    );
}
