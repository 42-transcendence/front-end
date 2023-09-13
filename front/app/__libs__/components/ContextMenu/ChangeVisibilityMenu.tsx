import { ActiveStatus } from "@common/generated/types";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useActiveStatusMutation } from "@hooks/useProfile";

export function ChangeVisibilityMenu() {
    const { sendPayload } = useWebSocket("chat", []);
    const { trigger, data } = useActiveStatusMutation(sendPayload);

    const visibilityStates = [
        { text: "온라인", value: ActiveStatus.ONLINE },
        { text: "자리비움", value: ActiveStatus.IDLE },
        { text: "다른 용무 중", value: ActiveStatus.DO_NOT_DISTURB },
        { text: "오프라인으로 표시", value: ActiveStatus.INVISIBLE },
    ];

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const newActiveStatus = e.target.value as ActiveStatus;
        void trigger(newActiveStatus);
    };
    return (
        <div className="relative flex h-fit w-full items-center rounded py-3">
            <div className="relative flex w-full flex-col justify-center px-4 py-1">
                <div className="flex select-none justify-start">상태 변경</div>
                <div className="flex select-none flex-row justify-around text-base">
                    {visibilityStates.map((state) => (
                        <label key={state.value} className="">
                            <input
                                type="radio"
                                name="current-visibility"
                                value={state.value}
                                className="hidden"
                                title={state.text}
                                defaultChecked={state.value === data}
                                onChange={handleChange}
                            />
                            {state.text}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
