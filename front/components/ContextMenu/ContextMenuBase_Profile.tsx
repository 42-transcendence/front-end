import React, { PropsWithChildren } from "react";
import { ContextMenuBase, ContextMenuItem } from "./ContextMenuBase";

export { ContextMenuItem } from "./ContextMenuBase";

export type ProfileItemConfig = {
    id: number;
    tag: string;
    name: string;
    statusMessage: string;
};

export function ContextMenuBase_Profile({
    profile,
    children,
}: PropsWithChildren<{ profile: ProfileItemConfig }>): React.ReactElement {
    //TODO: if profile.id is undefined, throw error

    return (
        <ContextMenuBase>
            <ContextMenuItem
                name={profile.name}
                description={profile.tag}
                className="text-xl"
                disabled
            />
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            {children}
        </ContextMenuBase>
    );
}
