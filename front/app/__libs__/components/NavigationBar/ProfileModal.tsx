"use client";

import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import { ContextMenu } from "@components/ContextMenu";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Provider, createStore } from "jotai";

export function ProfileModal() {
    const accountUUID = useCurrentAccountUUID();
    const store = createStore();
    store.set(TargetedAccountUUIDAtom, accountUUID);

    return (
        <Provider store={store}>
            <GlassWindow>
                <div className="w-full overflow-clip rounded-[28px] ">
                    <ContextMenu type="Navigation" />
                </div>
            </GlassWindow>
        </Provider>
    );
}
