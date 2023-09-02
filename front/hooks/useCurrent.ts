import { CurrentAccountUUIDAtom } from "@/atom/AccountAtom";
import { CurrentChatRoomUUIDAtom } from "@/atom/ChatAtom";
import { GlobalStore } from "@/atom/GlobalStore";
import { useAtomValue } from "jotai";

export function useCurrentAccountUUID() {
    return useAtomValue(CurrentAccountUUIDAtom, { store: GlobalStore });
}

export function useCurrentChatRoomUUID() {
    return useAtomValue(CurrentChatRoomUUIDAtom, { store: GlobalStore });
}
