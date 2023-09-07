import { ContextMenuItem } from "./ContextMenuItem";
import { useWebSocket } from "@/library/react/websocket-hook";
import { ContextMenuBase } from "./ContextMenuBase";
import { ByteBuffer } from "@/library/akasha-lib";
import { useAtomValue } from "jotai";
import { TargetedAccountUUIDAtom } from "@/atom/AccountAtom";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { usePublicProfile } from "@/hooks/useProfile";

export type Relationship = "myself" | "friend" | "stranger";

function ContextMenu_Myself() {
    //TODO: use SWR
    const name = "FALLBACK";
    const tag = "4242";

    return (
        <ContextMenuBase className="w-full">
            <ContextMenuItem
                name={name}
                description={tag}
                className="text-xl"
                disabled
            />
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            <ContextMenuItem name="내 상태 변경하기" className="basic" />
            <ContextMenuItem name="내 정보 수정하기" className="basic" />
            <ContextMenuItem name="로그아웃 하기" className="basic" />
        </ContextMenuBase>
    );
}

function ContextMenu_Friend() {
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
                className="hover:bg-red-500/30"
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

function ContextMenu_Stranger() {
    //TODO : friend add logic : check whether user is already friend or not.

    return (
        <>
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            <ContextMenuItem name="친구 추가하기" className="text-base" />
            <ContextMenuItem
                name="차단하기"
                className="text-base hover:bg-red-500/30"
            />
            <ContextMenuItem
                name="신고하기"
                className="text-base hover:bg-red-500/30"
            />
        </>
    );
}

// TODO: 나중에 다른 브랜치에서...리팩토링 합시다
export function ContextMenu({ type }: { type: Relationship }) {
    switch (type) {
        case "stranger":
            return <ContextMenu_Stranger />;
        case "friend":
            return <ContextMenu_Friend />;
        case "myself":
            return <ContextMenu_Myself />;
    }
}
