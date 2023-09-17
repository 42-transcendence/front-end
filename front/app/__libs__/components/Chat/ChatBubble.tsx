import { Avatar } from "../Avatar";
import { Chat, Icon } from "@components/ImageLibrary";
import type { MessageSchema } from "@akasha-utils/idb/chat-store";
import { usePublicProfile } from "@hooks/useProfile";
import { NickBlock } from "@components/ProfileItem/ProfileItem";
import { GUEST } from "@utils/constants";
import Link from "next/link";

export function ChatBubble({
    chatMessage,
    isContinued = false,
    isLastContinuedMessage = false,
    dir = "left",
}: {
    chatMessage: MessageSchema;
    isContinued: boolean;
    isLastContinuedMessage: boolean;
    dir: "left" | "right";
}) {
    const hidden = dir === "right" || isContinued ? "hidden" : "";
    return (
        <div
            className={`relative flex shrink flex-row pl-16 ${
                isContinued ? "pt-0" : "pt-8"
            }`}
        >
            <Avatar
                className={`${hidden} absolute left-0 top-0 h-12 w-12`}
                accountUUID={chatMessage.accountId}
                privileged={false}
            />
            <div
                className={`${hidden} absolute left-16 top-2 font-sans text-lg font-normal text-white `}
            >
                <NickBlock accountUUID={chatMessage.accountId} />
            </div>
            <ChatTextBubble
                chatMessage={chatMessage}
                isContinued={isContinued}
                isLastContinuedMessage={isLastContinuedMessage}
                dir={dir}
            />
        </div>
    );
}

function ChatTextBubble({
    chatMessage,
    isContinued,
    isLastContinuedMessage,
    dir,
}: {
    chatMessage: MessageSchema;
    isContinued: boolean;
    isLastContinuedMessage: boolean;
    dir: "left" | "right";
}) {
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
            <ContentBlock
                bgColor={styleOption.bgColor}
                content={chatMessage.content}
            />
            {isLastContinuedMessage && (
                <p className="static self-end p-3 py-1 font-sans text-sm font-normal text-gray-100/90">
                    {chatMessage.timestamp.toLocaleString(undefined, {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            )}
        </div>
    );
}

function ContentBlock({
    content,
    bgColor,
}: {
    content: string;
    bgColor: string;
}) {
    try {
        const url = new URL(content);
        console.log("URL Content = " + content);
        if (content.startsWith(`https://${GUEST}/game/`)) {
            return (
                <Link href={url.pathname}>
                    <div
                        className={`static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs select-text whitespace-pre-wrap break-all rounded-xl ${bgColor} p-3 font-sans text-base font-normal text-gray-100/90`}
                    >
                        <Icon.Arrow3 />
                        <p>게임으로 초대받았습니다!!</p>
                        <p>초대 코드: {url.pathname.substring("/game/".length)}</p>
                    </div>
                </Link>
            );
        }
    } catch {
        //NOTE: content is not URL. ignore
    }

    return (
        <span
            className={`static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs select-text whitespace-pre-wrap break-all rounded-xl ${bgColor} p-3 font-sans text-base font-normal text-gray-100/90`}
        >
            {content}
        </span>
    );
}

export function NoticeBubble({ chatMessage }: { chatMessage: MessageSchema }) {
    const params = new URLSearchParams(chatMessage.content);
    const memberProfile = usePublicProfile(params.get("member") ?? "");
    const sourceProfile = usePublicProfile(params.get("source") ?? "");

    const memberNick =
        memberProfile !== undefined
            ? `${memberProfile.nickName}#${memberProfile.nickTag}`
            : "불러오는 중...";
    const sourceNick =
        sourceProfile !== undefined
            ? `${sourceProfile.nickName}#${sourceProfile.nickTag}`
            : "불러오는 중...";

    let content = "";
    switch (params.get("type") ?? "") {
        case "create": {
            content = `${memberNick}님이 채팅방[${
                params.get("title") ?? ""
            }]을 개설했습니다.`;
            break;
        }
        case "enter": {
            content = `${memberNick}님이 입장했습니다.`;
            break;
        }
        case "leave": {
            content = `${memberNick}님이 퇴장했습니다.`;
            break;
        }
        case "invite": {
            content = `${sourceNick}님이 ${memberNick}님을 초대했습니다.`;
            break;
        }
        case "update": {
            content = `${memberNick}님이 채팅방 주제를 변경했습니다: [${
                params.get("title") ?? ""
            }]`;
            break;
        }
        case "promote": {
            content = `${memberNick}님이 관리자로 임명되었습니다.`;
            break;
        }
        case "demote": {
            content = `${memberNick}님이 관리자에서 해임되었습니다.`;
            break;
        }
        case "handover": {
            content = `${memberNick}님이 새로운 방장이 되었습니다.`;
            break;
        }
        case "kick": {
            content = `${sourceNick}님이 ${memberNick}님을 강제 퇴장시켰습니다.`;
            break;
        }
        case "mute": {
            content = `${sourceNick}님이 ${memberNick}님을 침묵시켰습니다.`;
            break;
        }
        case "unban": {
            content = `${sourceNick}님이 ${memberNick}님에 대한 제재를 취소했습니다.`;
            break;
        }
        case "": {
            //NOTE: 사실 데이터가 잘못되지 않는 이상 이럴 일은 없다.
            content = chatMessage.content;
            break;
        }
    }

    if (content === "") {
        return <></>;
    }

    return (
        <div className="relative flex h-fit w-full flex-col items-center px-3 py-3">
            <span className="static h-fit w-fit flex-1 whitespace-pre-wrap break-all rounded-xl bg-windowGlass/30 p-3 py-1 font-sans text-sm font-normal text-gray-100/90">
                {content}
            </span>
        </div>
    );
}
