import { HTTPError, fetcher, fetcherPOST } from "./fetcher";
import { useSWR, useSWRMutation } from "./useSWR";
import type {
    AccountProfilePrivatePayload,
    AccountProfileProtectedPayload,
    AccountProfilePublicPayload,
} from "@common/profile-payloads";
import { useCurrentAccountUUID } from "./useCurrent";
import { useSWRConfig } from "swr";
import { useCallback, useEffect } from "react";
import type {
    GameHistoryEntity,
    ActiveStatus,
    RecordEntity,
} from "@common/generated/types";
import { getActiveStatusNumber } from "@common/generated/types";
import type { ByteBuffer } from "@akasha-lib";
import { makeActiveStatusManualRequest } from "@akasha-utils/chat-payload-builder-client";

export function usePublicProfile(accountUUID: string) {
    const { data } = useSWR(
        () => (accountUUID !== "" ? `/profile/public/${accountUUID}` : null),
        fetcher<AccountProfilePublicPayload>,
    );
    return data;
}

export type TypeWithProfile<T, TProfile> = T & {
    _profile?: TProfile | undefined;
};

export function useProtectedProfile(accountUUID: string) {
    const { data } = useSWR(
        () => (accountUUID !== "" ? `/profile/protected/${accountUUID}` : null),
        fetcher<AccountProfileProtectedPayload>,
        { shouldRetryOnError: false, keepPreviousData: false },
    );
    return data;
}

export function usePublicProfiles<T>(
    id: string,
    accountObjects: T[],
    accountUUIDSelector: (arg: T) => string,
) {
    const { trigger, data } = useSWRMutation(
        () => ["Profiles", "Public", id],
        useCallback(
            async (_key, { arg: accountObjects }: { arg: T[] }) => {
                const promises =
                    Array<
                        Promise<TypeWithProfile<T, AccountProfilePublicPayload>>
                    >();
                for (const obj of accountObjects) {
                    const fetchPayload = async () => {
                        try {
                            const profile =
                                await fetcher<AccountProfilePublicPayload>(
                                    `/profile/public/${accountUUIDSelector(
                                        obj,
                                    )}`,
                                );
                            return { ...obj, _profile: profile };
                        } catch {
                            return { ...obj, _profile: undefined };
                        }
                    };
                    promises.push(fetchPayload());
                }
                return await Promise.all(promises);
            },
            [accountUUIDSelector],
        ),
        { revalidate: false },
    );
    useEffect(() => {
        void trigger(accountObjects);
    }, [trigger, accountObjects]);
    return data;
}

export function useProtectedProfiles<T>(
    id: string,
    accountObjects: T[],
    accountUUIDSelector: (arg: T) => string,
) {
    const { trigger, data } = useSWRMutation(
        () => ["Profiles", "Protected", id],
        useCallback(
            async (_key, { arg: accountObjects }: { arg: T[] }) => {
                const promises =
                    Array<
                        Promise<
                            TypeWithProfile<T, AccountProfileProtectedPayload>
                        >
                    >();
                for (const obj of accountObjects) {
                    const fetchPayload = async () => {
                        try {
                            const profile =
                                await fetcher<AccountProfileProtectedPayload>(
                                    `/profile/protected/${accountUUIDSelector(
                                        obj,
                                    )}`,
                                );
                            return { ...obj, _profile: profile };
                        } catch {
                            return { ...obj, _profile: undefined };
                        }
                    };
                    promises.push(fetchPayload());
                }
                return await Promise.all(promises);
            },
            [accountUUIDSelector],
        ),
        { revalidate: false },
    );
    useEffect(() => {
        void trigger(accountObjects);
    }, [trigger, accountObjects]);
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

export function useProfileMutation() {
    const currentAccountUUID = useCurrentAccountUUID();
    const { mutate } = useSWRConfig();

    return useCallback(
        (accountUUID: string) => {
            void mutate(`/profile/public/${accountUUID}`);
            void mutate(`/profile/protected/${accountUUID}`, undefined);
            if (accountUUID === currentAccountUUID) {
                void mutate("/profile/private");
            }
        },
        [currentAccountUUID, mutate],
    );
}

export function useNickLookup(name: string, tag: number) {
    const params = new URLSearchParams({ name, tag: tag.toString() });
    const result = useSWR(
        `/profile/lookup?${params.toString()}`,
        fetcher<string>,
    );
    const notFound: boolean =
        result.error instanceof HTTPError && result.error.status === 404;
    return {
        accountUUID: result.data ?? "",
        isLoading: result.isLoading,
        notFound,
    };
}

export function useProfileRecord(accountUUID: string) {
    const { data } = useSWR(
        () =>
            accountUUID !== "" ? `/profile/public/${accountUUID}/record` : null,
        fetcher<RecordEntity>,
    );
    return data;
}

export function useAvatarMutation() {
    const accountUUID = useCurrentAccountUUID();
    const mutateProfile = useProfileMutation();
    const callback = useCallback(
        async (key: string, { arg }: { arg: FormData }) => {
            await fetcherPOST(key, arg);
            mutateProfile(accountUUID);
        },
        [accountUUID, mutateProfile],
    );

    const result = useSWRMutation("/profile/private/avatar", callback, {
        throwOnError: false,
    });

    const error = result.error !== undefined;
    return { trigger: result.trigger, error };
}

export function useActiveStatusMutation(
    sendPayload: (value: ByteBuffer) => void,
) {
    const accountUUID = useCurrentAccountUUID();
    const callback = useCallback(
        (_key: string, { arg }: { arg: ActiveStatus }) => {
            const buf = makeActiveStatusManualRequest(
                getActiveStatusNumber(arg),
            );
            sendPayload(buf);
            return arg;
        },
        [sendPayload],
    );

    const { trigger, data } = useSWRMutation(
        () => (accountUUID !== "" ? "/profile/protected" : null),
        callback,
        {
            throwOnError: false,
        },
    );
    return { trigger, data };
}

export function useGameHistory(accountUUID: string) {
    const { data } = useSWR(
        () =>
            accountUUID !== ""
                ? `/profile/public/${accountUUID}/history`
                : null,
        fetcher<GameHistoryEntity[]>,
    );
    return data;
}
