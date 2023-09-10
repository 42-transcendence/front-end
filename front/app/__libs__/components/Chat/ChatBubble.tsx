import { Avatar } from "../Avatar";
import { Chat } from "@components/ImageLibrary";
import type { MessageSchema } from "@akasha-utils/idb/chat-store";
import { usePublicProfile } from "@hooks/useProfile";

export function ChatBubbleWithProfile({
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
    //TODO: apply direction
    //TODO: hide username, tail, profile when message is continued
    const profile = usePublicProfile(chatMessage.accountId);

    const nick =
        profile !== undefined
            ? `${profile.nickName}#${profile.nickTag}`
            : "불러오는 중...";

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
                accountUUID={chatMessage.accountId}
                privileged={false}
            />
            <div
                className={`${hidden} absolute -top-1 left-16 font-sans text-lg font-normal text-white `}
            >
                {nick}
            </div>
            <ChatBubble
                chatMessage={chatMessage}
                isContinued={isContinued}
                isLastContinuedMessage={isLastContinuedMessage}
                dir={dir}
            />
        </div>
    );
}

function ChatBubble({
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
            <span
                className={`static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs whitespace-pre-wrap break-all rounded-xl ${styleOption.bgColor} p-3 font-sans text-base font-normal text-gray-100/90`}
            >
                {chatMessage.content}
            </span>
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
            //TODO: 사실 데이터가 잘못되지 않는 이상 이럴 일은 없다.
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
