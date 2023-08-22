import {
    StatusOnline,
    StatusInvisible,
    StatusOffline,
    StatusIdle,
    StatusMatching,
    StatusDoNotDisturb,
    StatusInGame,
} from "@/components/ImageLibrary";
import { ActiveStatusNumber } from "@/library/generated/types";

const StatusPair = {
    [ActiveStatusNumber.ONLINE]: <StatusOnline height="100%" width="100%" />,
    [ActiveStatusNumber.INVISIBLE]: (
        <StatusInvisible height="100%" width="100%" />
    ),
    [ActiveStatusNumber.OFFLINE]: <StatusOffline height="100%" width="100%" />,
    [ActiveStatusNumber.IDLE]: <StatusIdle height="100%" width="100%" />,
    [ActiveStatusNumber.MATCHING]: (
        <StatusMatching height="100%" width="100%" />
    ),
    [ActiveStatusNumber.DO_NOT_DISTURB]: (
        <StatusDoNotDisturb height="100%" width="100%" />
    ),
    [ActiveStatusNumber.GAME]: <StatusInGame height="100%" width="100%" />,
} as const;

export function Status({ type }: { type: ActiveStatusNumber }) {
    return StatusPair[type];
}
