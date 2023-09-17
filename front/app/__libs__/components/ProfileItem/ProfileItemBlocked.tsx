import { handleUnbanMemberResult } from "@akasha-utils/chat-gateway-client";
import {
    makeBanListRequest,
    makeDeleteEnemyRequest,
    makeUnbanMemberRequest,
} from "@akasha-utils/chat-payload-builder-client";
import { ChatErrorNumber } from "@common/chat-payloads";
import type { ChatBanDetailEntry, EnemyEntry } from "@common/chat-payloads";
import { Avatar } from "@components/Avatar";
import { NickBlock } from "./ProfileItem";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { handleChatError } from "@components/Chat/handleChatError";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";

export function ProfileItemBlocked({
    className,
    selected,
    entry,
    onClick,
}: React.PropsWithChildren<{
    className?: string | undefined;
    entry: ChatBanDetailEntry;
    selected: boolean;
    onClick: React.MouseEventHandler;
}>) {
    const currentChatRoomId = useCurrentChatRoomUUID();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.UNBAN_MEMBER_RESULT,
        (_, buf) => {
            const [errno] = handleUnbanMemberResult(buf);
            if (errno === ChatErrorNumber.SUCCESS) {
                alert("차단을 해제했습니다.");
                return makeBanListRequest(currentChatRoomId);
            } else {
                handleChatError(errno);
            }
            return undefined;
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
                            accountUUID={entry.accountId}
                            className="relative w-6"
                            privileged={true}
                        />
                    </div>
                    <div className="w-full overflow-hidden">
                        <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 transition-all ease-linear group-hover/profile:-translate-x-[150%] group-hover/profile:overflow-visible group-hover/profile:delay-300 group-hover/profile:duration-[5000ms]">
                            <NickBlock accountUUID={entry.accountId} />
                        </div>
                    </div>
                </div>
                {selected ? (
                    <div className="flex w-full flex-col gap-2 p-2">
                        <div className="flex w-full flex-col rounded px-2">
                            <span className="text-gray-50">차단 사유</span>
                            {entry.memo}
                            <span className="text-gray-50">기간</span>
                            {entry.expireTimestamp?.toString()}
                        </div>
                        <button
                            onClick={(event) => {
                                event.preventDefault();
                                sendPayload(makeUnbanMemberRequest(entry.id));
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

export function ProfileItemEnemy({
    className,
    selected,
    entry,
    onClick,
}: React.PropsWithChildren<{
    className?: string | undefined;
    entry: EnemyEntry;
    selected: boolean;
    onClick: React.MouseEventHandler;
}>) {
    const currentChatRoomId = useCurrentChatRoomUUID();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.UNBAN_MEMBER_RESULT,
        (_, buf) => {
            const [errno] = handleUnbanMemberResult(buf);
            if (errno === ChatErrorNumber.SUCCESS) {
                alert("차단을 해제했습니다.");
                return makeBanListRequest(currentChatRoomId);
            } else {
                handleChatError(errno);
            }
            return undefined;
        },
    );

    return (
        <li
            className={`relative flex h-fit w-full shrink-0 flex-col items-start ${className}`}
        >
            <div className="relative flex flex-col items-start self-stretch rounded ">
                <div
                    onClick={onClick}
                    className="group/profile relative flex w-full select-none items-center gap-4 rounded p-2 hover:bg-primary/30"
                >
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            accountUUID={entry.enemyAccountId}
                            className="relative w-6 bg-windowGlass/30"
                            privileged={true}
                        />
                    </div>
                    <div className="w-full overflow-hidden">
                        <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 transition-all ease-linear group-hover/profile:-translate-x-[150%] group-hover/profile:overflow-visible group-hover/profile:delay-300 group-hover/profile:duration-[5000ms]">
                            <NickBlock accountUUID={entry.enemyAccountId} />
                        </div>
                    </div>
                </div>
                {selected ? (
                    <div className="flex w-full flex-col gap-2 p-2">
                        <div className="flex w-full flex-col rounded px-2">
                            <span className="text-gray-50">차단 사유</span>
                            {entry.memo}
                        </div>
                        <button
                            onClick={(event) => {
                                event.preventDefault();
                                sendPayload(
                                    makeDeleteEnemyRequest(
                                        entry.enemyAccountId,
                                    ),
                                );
                            }}
                            className="w-full rounded bg-red-500 p-2 text-sm text-gray-50"
                        >
                            차단 해제하기
                        </button>
                    </div>
                ) : null}
            </div>
        </li>
    );
}
