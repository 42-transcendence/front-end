import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { fetchEndAuth } from "./fetcher";
import { useAtomCallback } from "jotai/utils";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { GlobalStore } from "@/atom/GlobalStore";

export function useAuthEnd(searchParams: ReadonlyURLSearchParams) {
    const callback = useAtomCallback(
        useCallback(
            async (get, set, _key: string) => {
                return await fetchEndAuth(set, searchParams);
            },
            [searchParams],
        ),
        { store: GlobalStore },
    );
    const { data } = useSWR("/auth/end", callback);
    return data;
}
