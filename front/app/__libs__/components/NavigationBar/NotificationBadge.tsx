export function NotificationBadge({
    totalUnreadCount,
}: {
    totalUnreadCount: number | undefined;
}) {
    if (totalUnreadCount === undefined || totalUnreadCount === 0) {
        return null;
    }
    return (
        <div className="absolute right-2 top-2 flex h-fit w-fit rounded-lg bg-red-500/90 p-1">
            <div className="h-1 w-1 rounded-full bg-white"></div>
        </div>
    );
}
