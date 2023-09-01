import { CurrentChatRoomUUIDAtom } from "@/atom/ChatAtom";
import { ByteBuffer } from "@/library/akasha-lib";
import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import { useWebSocket } from "@/library/react/websocket-hook";
import { useAtomValue } from "jotai";

function useLeaveChatRoom(chatRoomUUID: string) {
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.LEAVE_ROOM_RESULT,
        async (_, buf) => {
            const errno = buf.read1();
            if (errno !== 0) {
                alert("방 나가기 실패!!!" + errno);
                // FIXME: 방 나가기가 실패하는 경우란?
                // 입장하지 않았을 때? 방장? 이라고 백엔드 코드에 써져있네
            }
        },
    );

    return () => {
        if (chatRoomUUID === "") {
            //TODO: 뭐함?
            alert("방이 선택되어 있지 않습니다.");
            return;
        }
        if (confirm("정말로 나가시겠습니까?")) {
            const buf = ByteBuffer.createWithOpcode(
                ChatServerOpcode.LEAVE_ROOM,
            );
            buf.writeUUID(chatRoomUUID);
            sendPayload(buf);
        }
    };
}

function useLeaveCurrentChatRoom() {
    const currentChatRoomUUID = useAtomValue(CurrentChatRoomUUIDAtom);

    return useLeaveChatRoom(currentChatRoomUUID);
}

export function useChatRoomMenuActions() {
    return {
        leaveCurrentChatRoom: useLeaveCurrentChatRoom(),
    };
}
