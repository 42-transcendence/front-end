import { CurrentChatRoomAtom, CurrentChatRoomUUIDAtom } from "@/atom/ChatAtom";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatClientOpcode, ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { useWebSocket } from "@/library/react/websocket-hook";
import { useAtomValue, useSetAtom } from "jotai";

function useLeaveChatRoom(chatRoomUUID: string) {
    const setCurrentChatRoom = useSetAtom(CurrentChatRoomAtom);
    const { sendPayload } = useWebSocket("chat", ChatClientOpcode.LEAVE_ROOM_FAILED,
        (_, buf) => {
            const errno = buf.read1();
            if (errno === 0) {
                setCurrentChatRoom("")
                    .then(() => { }) // FIXME: 왼쪽 목록에서도 사라지게 하기. setCurrentChatRoom이 실패하는 경우란?
                    .catch(() => { });
            }
            else {
                // FIXME: 방 나가기가 실패하는 경우란?
                // 입장하지 않았을 때? 방장? 이라고 백엔드 코드에 써져있네
            }
        });

    return () => {
        const buf = ByteBuffer.createWithOpcode(ChatServerOpcode.LEAVE_ROOM);
        buf.writeUUID(chatRoomUUID);
        sendPayload(buf);
        console.log(`i will leave room ${chatRoomUUID}`);
    }
}

function useLeaveCurrentChatRoom() {
    const currentChatRoomUUID = useAtomValue(CurrentChatRoomUUIDAtom);

    return useLeaveChatRoom(currentChatRoomUUID);
}

export function useChatRoomMenuActions() {
    return {
        leaveCurrentChatRoom: useLeaveCurrentChatRoom(),
    }
}
