import { Status as StatusIcon } from "@components/ImageLibrary";
import { ActiveStatusNumber } from "@common/generated/types";

const StatusPair = {
    [ActiveStatusNumber.ONLINE]: (
        <StatusIcon.Online height="100%" width="100%" />
    ),
    [ActiveStatusNumber.INVISIBLE]: (
        <StatusIcon.Invisible height="100%" width="100%" />
    ),
    [ActiveStatusNumber.OFFLINE]: (
        <StatusIcon.Offline height="100%" width="100%" />
    ),
    [ActiveStatusNumber.IDLE]: <StatusIcon.Idle height="100%" width="100%" />,
    [ActiveStatusNumber.MATCHING]: (
        <StatusIcon.Matching height="100%" width="100%" />
    ),
    [ActiveStatusNumber.DO_NOT_DISTURB]: (
        <StatusIcon.DoNotDisturb height="100%" width="100%" />
    ),
    [ActiveStatusNumber.GAME]: <StatusIcon.InGame height="100%" width="100%" />,
} as const;

export function Status({ type }: { type: ActiveStatusNumber }) {
    return StatusPair[type];
}
