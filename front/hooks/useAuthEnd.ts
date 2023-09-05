import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { fetchEndAuth } from "./fetcher";
import type { ReadonlyURLSearchParams } from "next/navigation";

export function useAuthEnd(searchParams: ReadonlyURLSearchParams) {
    const callback = useCallback(
        async () => fetchEndAuth(searchParams),
        [searchParams],
    );
    const { data } = useSWR("/auth/end", callback);
    return data;
}
