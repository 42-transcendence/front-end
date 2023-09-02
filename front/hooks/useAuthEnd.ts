import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { fetchEndAuth } from "./fetcher";
import { useAtomCallback } from "jotai/utils";
import type { ReadonlyURLSearchParams } from "next/navigation";

export function useAuthEnd(searchParams: ReadonlyURLSearchParams) {
    const callback = useAtomCallback(
        useCallback(
            async (get, set, _key: string) => {
                return await fetchEndAuth(set, searchParams);
            },
            [searchParams],
        ),
    );
    const { data } = useSWR("/auth/end", callback);
    return data;
}
