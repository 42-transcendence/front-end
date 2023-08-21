import {
    StatusOnline,
    StatusInvisible,
    StatusOffline,
    StatusIdle,
    StatusMatching,
    StatusDoNotDisturb,
    StatusInGame,
} from "@/components/ImageLibrary";

const StatusPair = {
    "online": <StatusOnline height="100%" width="100%" />,
    "invisible": <StatusInvisible height="100%" width="100%" />,
    "offline": <StatusOffline height="100%" width="100%" />,
    "idle": <StatusIdle height="100%" width="100%" />,
    "matching": <StatusMatching height="100%" width="100%" />,
    "do-not-disturb": <StatusDoNotDisturb height="100%" width="100%" />,
    "in-game": <StatusInGame height="100%" width="100%" />,
} as const;

export type StatusType = keyof typeof StatusPair;

export function Status({ type }: { type: StatusType }) {
    return (
        StatusPair[type]
    );
}
