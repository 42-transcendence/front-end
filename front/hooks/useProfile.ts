import { fetcher } from "./fetcher";
import { useSWR } from "./useSWR";
import type {
    AccountProfilePrivatePayload,
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@/library/payload/profile-payloads";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { GlobalStore } from "@/atom/GlobalStore";
import { useCurrentAccountUUID } from "./useCurrent";

export function usePublicProfile(accountUUID: string) {
    const callback = useAtomCallback(
        useCallback(async (get, set, key: string) => {
            return await fetcher<AccountProfilePublicPayload>(get, set, key);
        }, []),
        { store: GlobalStore },
    );
    const { data } = useSWR(`/profile/public/${accountUUID}`, callback);
    return data;
}

export function useProtectedProfile(accountUUID: string) {
    const callback = useAtomCallback(
        useCallback(async (get, set, key: string) => {
            return await fetcher<AccountProfileProtectedPayload>(get, set, key);
        }, []),
        { store: GlobalStore },
    );
    const { data } = useSWR(`/profile/protected/${accountUUID}`, callback);
    return data;
}

export function usePrivateProfile() {
    const currentAccountUUID = useCurrentAccountUUID();
    const callback = useAtomCallback(
        useCallback(async (get, set, key: string) => {
            return await fetcher<AccountProfilePrivatePayload>(get, set, key);
        }, []),
        { store: GlobalStore },
    );
    const { data } = useSWR(
        () => (currentAccountUUID !== "" ? "/profile/private" : null),
        callback,
    );
    return data;
}
