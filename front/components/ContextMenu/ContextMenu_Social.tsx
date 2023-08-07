import React from "react";
import {
    ContextMenuBase_Profile,
    ContextMenuItem,
    ProfileItemConfig,
} from "./ContextMenuBase_Profile";

export function ContextMenu_Social({
    profile,
}: {
    profile: ProfileItemConfig;
}) {
    return (
        <ContextMenuBase_Profile profile={profile}>
            <ContextMenuItem name="친구 추가하기" className="basic" />
            <ContextMenuItem name="차단하기" className="basic" />
            <ContextMenuItem name="신고하기" className="basic" />
        </ContextMenuBase_Profile>
    );
}
