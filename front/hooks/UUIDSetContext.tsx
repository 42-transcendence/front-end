"use client";

import { createContext, useContext, useMemo, useReducer, useRef } from "react";

class UUIDSet extends Set<string> {
    constructor(readonly forceUpdate: () => void) {
        super();
    }
}

const UUIDSetContext = createContext({ set: new UUIDSet(() => {}) });

export function UUIDSetContainer({ children }: React.PropsWithChildren) {
    const [version, forceUpdate] = useReducer((x: number) => x + 1, 0);
    const uuidSetRef = useRef(new UUIDSet(forceUpdate));
    const uuidSet = useMemo(
        () => ({ set: uuidSetRef.current, version }),
        [version],
    );
    return (
        <UUIDSetContext.Provider value={uuidSet}>
            {children}
        </UUIDSetContext.Provider>
    );
}

export function useUUIDSet(): [
    uuidSet: UUIDSet,
    toggleUUID: (value: string) => void,
] {
    const context = useContext(UUIDSetContext);
    const uuidSet = context.set;

    const toggleUUID = (value: string) => {
        if (uuidSet.has(value)) {
            uuidSet.delete(value);
        } else {
            uuidSet.add(value);
        }
        uuidSet.forceUpdate();
    };

    return [uuidSet, toggleUUID];
}
