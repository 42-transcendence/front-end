"use client";

import { GlobalStore } from "@/atom/GlobalStore";
import { Provider } from "jotai";

export function Providers({ children }: React.PropsWithChildren) {
    return <Provider store={GlobalStore}>{children} </Provider>;
}
