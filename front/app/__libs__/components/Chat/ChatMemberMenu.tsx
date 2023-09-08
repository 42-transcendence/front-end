// FIXME: 현재 안쓰이는 컴포넌트
import { MenuItem } from "./MenuItem";

export function ChatMemberMenu({
    className,
    isAdmin,
}: {
    className: string;
    isAdmin: boolean;
}) {
    return (
        <div
            className={`${className} flex-col items-center text-base font-bold text-gray-100/80`}
        >
            {isAdmin && (
                <MenuItem className="active:bg-secondary/80">
                    정지 유저 관리
                </MenuItem>
            )}
            {isAdmin && (
                <MenuItem className="active:bg-secondary/80">
                    채팅금지 유저 관리
                </MenuItem>
            )}
        </div>
    );
}
