import { ActiveStatus } from "@common/generated/types";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useActiveStatusMutation } from "@hooks/useProfile";
import { Status } from "@components/ImageLibrary";

export function ChangeVisibilityMenu() {
    const { sendPayload } = useWebSocket("chat", []);
    const { trigger, data } = useActiveStatusMutation(sendPayload);

    const visibilityStates = [
        {
            icon: (
                <Status.Online className="h-10 w-10 rounded-lg p-2 hover:bg-primary/30 active:bg-secondary/70" />
            ),
            text: "온라인",
            value: ActiveStatus.ONLINE,
        },
        {
            icon: (
                <Status.Idle className="h-10 w-10 rounded-lg p-2 hover:bg-primary/30 active:bg-secondary/70" />
            ),
            text: "자리비움",
            value: ActiveStatus.IDLE,
        },
        {
            icon: (
                <Status.DoNotDisturb className="h-10 w-10 rounded-lg p-2 hover:bg-primary/30 active:bg-secondary/70" />
            ),
            text: "다른 용무 중",
            value: ActiveStatus.DO_NOT_DISTURB,
        },
        {
            icon: (
                <Status.Invisible className="h-10 w-10 rounded-lg p-2 hover:bg-primary/30 active:bg-secondary/70" />
            ),
            text: "오프라인으로 표시",
            value: ActiveStatus.INVISIBLE,
        },
    ];

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newActiveStatus = e.target.value as ActiveStatus;
        void trigger(newActiveStatus);
    };
    return (
        <div className="relative flex h-fit w-60 items-center rounded px-4 pt-4">
            <div className="flex w-full select-none flex-col justify-around rounded-xl bg-black/30 p-2 text-base">
                <span className="p-1 text-sm">상태 변경</span>
                <div className="flex flex-row justify-between gap-1">
                    {visibilityStates.map((state) => (
                        <label
                            title={state.text}
                            key={state.value}
                            className={`rounded-lg outline-none ${
                                state.value === data &&
                                "focus-within:outline-1 focus-within:outline-primary"
                            }`}
                        >
                            {state.icon}
                            <input
                                type="radio"
                                name="current-visibility"
                                value={state.value}
                                className="sr-only"
                                defaultChecked={state.value === data}
                                onChange={handleChange}
                            />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
