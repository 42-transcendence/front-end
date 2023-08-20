import React from "react";
import { ContextMenuItem, ProfileItemConfig } from "./ContextMenuBase_Profile";

export function ContextMenu_Social({ info }: { info: ProfileItemConfig }) {
    void info;
    //TODO : friend add logic : check whether user is already friend or not.

    return (
        <>
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            <ContextMenuItem name="친구 추가하기" className="text-base" />
            <ContextMenuItem
                name="차단하기"
                className="text-base hover:bg-red-500/30"
            />
            <ContextMenuItem
                name="신고하기"
                className="text-base hover:bg-red-500/30"
            />
        </>
    );
}
