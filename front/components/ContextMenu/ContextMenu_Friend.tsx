import React from "react";
import {
    ContextMenuBase_Profile,
    ContextMenuItem,
    ProfileItemConfig,
} from "./ContextMenuBase_Profile";
import { ContextMenuBase } from "./ContextMenuBase";

export function ContextMenu_Friend({
    profile,
}: {
    profile: ProfileItemConfig;
}): React.ReactElement {
    //TODO: fetch score
    const score = 1321;
    return (
        <ContextMenuBase className="w-full">
            <ContextMenuItem
                name={` 점수: ${score} `}
                className="hover:bg-transparent active:bg-transparent "
            />
            <ContextMenuItem name="태그 복사하기" className="" />
            <ContextMenuItem name="프로필 보기" className="" />
            <ContextMenuItem name="친구 그룹 변경하기" className="" />
            <ContextMenuItem
                name="친구 삭제"
                className=" hover:bg-red-500/30"
            />
            <ContextMenuItem name="신고하기" className=" hover:bg-red-500/30" />
        </ContextMenuBase>
    );
}
