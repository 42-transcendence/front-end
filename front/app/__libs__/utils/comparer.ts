import { getActiveStatusOrder } from "@common/auth-payloads";
import type { ChatDirectEntry, FriendEntry } from "@common/chat-payloads";
import type {
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@common/profile-payloads";
import type { TypeWithProfile } from "@hooks/useProfile";

type ProtectedFriendCompareType = TypeWithProfile<
    FriendEntry,
    AccountProfileProtectedPayload
>;

export function compareProtectedFriendEntry(
    e1: ProtectedFriendCompareType,
    e2: ProtectedFriendCompareType,
) {
    const profile1 = e1._profile;
    const profile2 = e2._profile;

    if (profile1 === undefined) return -1;
    if (profile2 === undefined) return 1;

    if (profile1.activeStatus !== profile2.activeStatus) {
        return getActiveStatusOrder(profile1.activeStatus) >
            getActiveStatusOrder(profile2.activeStatus)
            ? -1
            : 1;
    }

    const nick1 = profile1.nickName ?? "";
    const nick2 = profile2.nickName ?? "";

    if (nick1 !== nick2) {
        return nick1 > nick2 ? 1 : -1;
    }

    return profile1.nickTag > profile2.nickTag ? 1 : -1;
}
export function compareRoomItem<T extends Record<"title", string>>(
    e1: T,
    e2: T,
) {
    return e1.title > e2.title ? 1 : -1;
}

export function compareDirectRoomItem(
    e1: ChatDirectEntry & {
        _profile?: AccountProfilePublicPayload | undefined;
    },
    e2: ChatDirectEntry & {
        _profile?: AccountProfilePublicPayload | undefined;
    },
) {
    return (e1._profile?.nickName ?? "") > (e2._profile?.nickName ?? "")
        ? 1
        : -1;
}
