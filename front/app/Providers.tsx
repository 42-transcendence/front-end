"use client";
import { Provider } from "jotai";

export function Providers({ children }: React.PropsWithChildren) {
    return <Provider>{children} </Provider>;
}
