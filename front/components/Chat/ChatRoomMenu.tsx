import React, { ReactNode } from "react";

function MenuItem({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`${className} w-full max-w-[240px] rounded-xl p-3 text-center hover:bg-primary/50 `}
        >
            {children}
        </span>
    );
}

export function ChatRoomMenu() {
    return (
        <div className="flex flex-col items-center text-base font-bold text-gray-100/80">
            <MenuItem className="active:bg-secondary/80">알림 설정 </MenuItem>
            <MenuItem className="active:bg-secondary/80">
                정지 유저 관리
            </MenuItem>
            <MenuItem className="active:bg-secondary/80">소유권 양도 </MenuItem>
            <MenuItem className="active:bg-red-500/80">채팅방 삭제 </MenuItem>
            <MenuItem className="active:bg-red-500/80">방 나가기 </MenuItem>
        </div>
    );
}
