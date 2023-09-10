import { CurrentAccountUUIDAtom } from "@atoms/AccountAtom";
import { CurrentChatRoomUUIDAtom } from "@atoms/ChatAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

export function useCurrentAccountUUID() {
    return useAtomValue(CurrentAccountUUIDAtom, { store: GlobalStore });
}

export function useCurrentChatRoomUUID() {
    return useAtomValue(CurrentChatRoomUUIDAtom, { store: GlobalStore });
}

export function useResetCurrentChatRoomUUID() {
    const set = useSetAtom(CurrentChatRoomUUIDAtom, { store: GlobalStore });
    return useCallback(() => set(""), [set]);
}
