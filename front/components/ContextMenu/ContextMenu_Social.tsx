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
        <>
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            <ContextMenuItem name="친구 추가하기" className="text-base" />
            <ContextMenuItem name="차단하기" className="text-base" />
            <ContextMenuItem name="신고하기" className="text-base" />
        </>
    );
}
