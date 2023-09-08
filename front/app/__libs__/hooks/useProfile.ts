import { HTTPError, fetcher } from "./fetcher";
import { useSWR } from "./useSWR";
import type {
    AccountProfilePrivatePayload,
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@common/profile-payloads";
import { useCurrentAccountUUID } from "./useCurrent";

export function usePublicProfile(accountUUID: string) {
    const { data } = useSWR(
        () => (accountUUID !== "" ? `/profile/public/${accountUUID}` : null),
        fetcher<AccountProfilePublicPayload>,
    );
    return data;
}

export function useProtectedProfile(accountUUID: string) {
    const { data } = useSWR(
        () => (accountUUID !== "" ? `/profile/protected/${accountUUID}` : null),
        fetcher<AccountProfileProtectedPayload>,
    );
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

export function useNickLookup(name: string, tag: number) {
    const params = new URLSearchParams({ name, tag: tag.toString() });
    const result = useSWR(
        `/profile/lookup?${params.toString()}`,
        fetcher<string>,
    );
    const notFound: boolean =
        result.error instanceof HTTPError && result.error.status === 404;
    return { accountUUID: result.data ?? "", isLoading: result.isLoading, notFound };
}
