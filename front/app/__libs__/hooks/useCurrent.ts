import { CurrentAccountUUIDAtom } from "@atoms/AccountAtom";
import { CurrentChatRoomUUIDAtom } from "@atoms/ChatAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { useAtomValue } from "jotai";

export function useCurrentAccountUUID() {
    return useAtomValue(CurrentAccountUUIDAtom, { store: GlobalStore });
}

export function useCurrentChatRoomUUID() {
    return useAtomValue(CurrentChatRoomUUIDAtom, { store: GlobalStore });
}
