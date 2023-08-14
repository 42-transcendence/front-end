import React from "react";

function MenuItem({
    children,
    className,
}: React.PropsWithChildren<{ className?: string }>) {
    return (
        <span
            className={`${className} w-full max-w-[240px] rounded-xl p-3 text-center hover:bg-primary/50 `}
        >
            {children}
        </span>
    );
}

export function ChatRoomMenu({
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
            <MenuItem className="active:bg-secondary/80">알림 설정</MenuItem>
            {isAdmin && (
                <MenuItem className="active:bg-secondary/80">
                    정지 유저 관리
                </MenuItem>
            )}
            {isAdmin && (
                <MenuItem className="active:bg-secondary/80">
                    소유권 양도
                </MenuItem>
            )}
            {isAdmin && (
                <MenuItem className="hover:bg-red-500/80 active:bg-secondary/80">
                    채팅방 삭제
                </MenuItem>
            )}
            <MenuItem className="hover:bg-red-500/80 active:bg-secondary/80">
                방 나가기
            </MenuItem>
        </div>
    );
}
