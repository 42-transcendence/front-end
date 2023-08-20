import React from "react";
import {
    ContextMenuBase_Profile,
    ContextMenuItem,
    ProfileItemConfig,
} from "./ContextMenuBase_Profile";

export function ContextMenu_MyProfile({
    info: profile,
}: {
    info: ProfileItemConfig;
}): React.ReactElement {
    return (
        <ContextMenuBase_Profile profile={profile}>
            <ContextMenuItem name="내 상태 변경하기" className="basic" />
            <ContextMenuItem name="내 정보 수정하기" className="basic" />
            <ContextMenuItem name="로그아웃 하기" className="basic" />
        </ContextMenuBase_Profile>
    );
}
