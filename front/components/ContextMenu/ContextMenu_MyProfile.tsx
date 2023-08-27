import { ContextMenuBase_Profile } from "./ContextMenuBase_Profile";
import type { ProfileItemConfig } from "./ContextMenuBase_Profile";
import { ContextMenuItem } from "./ContextMenuItem";

export function ContextMenu_MyProfile({
    info,
}: {
    info: ProfileItemConfig;
}) {
    return (
        <ContextMenuBase_Profile profile={info}>
            <ContextMenuItem name="내 상태 변경하기" className="basic" />
            <ContextMenuItem name="내 정보 수정하기" className="basic" />
            <ContextMenuItem name="로그아웃 하기" className="basic" />
        </ContextMenuBase_Profile>
    );
}
