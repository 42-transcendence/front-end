import { handleUnbanMemberResult } from "@akasha-utils/chat-gateway-client";
import { makeUnbanMemberRequest } from "@akasha-utils/chat-payload-builder-client";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { ChatBanDetailEntry, ChatErrorNumber } from "@common/chat-payloads";
import { Avatar } from "@components/Avatar";
import { handleChatError } from "@components/Chat/handleChatError";
import { usePublicProfile } from "@hooks/useProfile";

export function ProfileItemBlocked({
    className,
    selected,
    detail,
    children,
    onClick,
}: React.PropsWithChildren<{
    className?: string | undefined;
    detail: ChatBanDetailEntry;
    selected: boolean;
    onClick: React.MouseEventHandler;
}>) {
    const profile = usePublicProfile(detail.accountId);
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.UNBAN_MEMBER_RESULT,
        (_, buf) => {
            const [errno] = handleUnbanMemberResult(buf);
            if (errno === ChatErrorNumber.SUCCESS) {
                alert("차단이 해제되었습니다.  ");
            } else {
                handleChatError(errno);
            }
        },
    );

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
                        <Avatar
                            accountUUID={detail.accountId}
                            className="w-6"
                            privileged={true}
                        />
                    </div>
                    <div className="w-full overflow-hidden">
                        <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 transition-all ease-linear group-hover/profile:-translate-x-[150%] group-hover/profile:overflow-visible group-hover/profile:delay-300 group-hover/profile:duration-[5000ms]">
                            {profile?.nickName ?? "loading..."}
                        </div>
                    </div>
                </div>
                {selected ? (
                    <div className="flex w-full flex-col gap-2 p-2">
                        <div className="flex w-full flex-col rounded px-2">
                            <span className="text-gray-50">차단 사유</span>
                            {detail.memo}
                            <span className="text-gray-50">기간</span>
                            {detail.expireTimestamp?.toString() ?? "unlimited"}
                        </div>
                        <button
                            onClick={(event) => {
                                event.preventDefault();
                                sendPayload(makeUnbanMemberRequest(detail.id));
                            }}
                            className="w-full rounded bg-red-500 p-2 text-sm"
                        >
                            차단 해제하기
                        </button>
                    </div>
                ) : null}
            </div>
        </li>
    );
}
