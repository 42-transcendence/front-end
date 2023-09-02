import { useWebSocket } from "@/library/react/websocket-hook";
import { ContextMenuBase } from "./ContextMenuBase";
import { ContextMenuItem } from "./ContextMenuItem";
import { ByteBuffer } from "@/library/akasha-lib";
import { useAtomValue } from "jotai";
import { TargetedAccountUUIDAtom } from "@/atom/AccountAtom";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { usePublicProfile } from "@/hooks/useProfile";

export function ContextMenu_Friend() {
    const { sendPayload } = useWebSocket("chat", []);
    const accountUUID = useAtomValue(TargetedAccountUUIDAtom);
    const profile = usePublicProfile(accountUUID);
    //TODO: fetch score
    const score = 1321;

    return (
        <ContextMenuBase className="w-full">
            <ContextMenuItem
                name={` 점수: ${score} `}
                className="hover:bg-transparent active:bg-transparent "
            />
            <ContextMenuItem name="태그 복사하기" className="" />
            <ContextMenuItem name="프로필 보기" className="" />
            <ContextMenuItem name="친구 그룹 변경하기" className="" />
            <ContextMenuItem
                name="친구 삭제"
                className=" hover:bg-red-500/30"
                onClick={() => {
                    if (
                        confirm(
                            `진짜로 정말로 [${profile?.nickName}]님을 친구 목록에서 삭제하실건가요...?`,
                        )
                    ) {
                        const buf = ByteBuffer.createWithOpcode(
                            ChatServerOpcode.DELETE_FRIEND,
                        );
                        buf.writeUUID(accountUUID);
                        sendPayload(buf);
                    }
                }}
            />
            <ContextMenuItem name="신고하기" className=" hover:bg-red-500/30" />
        </ContextMenuBase>
    );
}
