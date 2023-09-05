import { fetcher } from "./fetcher";
import { useSWR } from "./useSWR";
import type {
    AccountProfilePrivatePayload,
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@/library/payload/profile-payloads";
import { useCurrentAccountUUID } from "./useCurrent";

export function usePublicProfile(accountUUID: string) {
    const { data } = useSWR(`/profile/public/${accountUUID}`, fetcher<AccountProfilePublicPayload>);
    return data;
}

export function useProtectedProfile(accountUUID: string) {
    const { data } = useSWR(`/profile/protected/${accountUUID}`, fetcher<AccountProfileProtectedPayload>);
    return data;
}

export function usePrivateProfile() {
    const currentAccountUUID = useCurrentAccountUUID();
    const { data } = useSWR(
        () => (currentAccountUUID !== "" ? "/profile/private" : null),
        fetcher<AccountProfilePrivatePayload>,
    );
    return data;
}
