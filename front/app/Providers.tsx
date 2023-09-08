"use client";

import { GlobalStore } from "@atoms/GlobalStore";
import { Provider } from "jotai";

export function Providers({ children }: React.PropsWithChildren) {
    return <Provider store={GlobalStore}>{children} </Provider>;
}
