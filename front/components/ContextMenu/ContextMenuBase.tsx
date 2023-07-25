import React from "react";

export { ContextMenuItem } from "./ContextMenuItem";

export function ContextMenuBase({
    children,
}: React.PropsWithChildren): React.ReactElement {
    return <div className="">{children}</div>;
}
