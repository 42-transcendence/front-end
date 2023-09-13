import { useProtectedProfile } from "@hooks/useProfile";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { makeStatusMessageRequest } from "@akasha-utils/chat-payload-builder-client";
import { Icon } from "@components/ImageLibrary";

export function ChangeStatusMessageMenu({
    targetAccountUUID,
}: {
    targetAccountUUID: string;
}) {
    const { sendPayload } = useWebSocket("chat", []);
    const protectedProfile = useProtectedProfile(targetAccountUUID);

    const currentStatusMessage = protectedProfile?.statusMessage ?? "";

    const handleClick = () => {
        const newMessage = prompt(
            "새 상태메시지를 입력해 주세요.",
            currentStatusMessage,
        );
        if (newMessage === null) {
            return;
        }
        sendPayload(makeStatusMessageRequest(newMessage));
    };

    return (
        <div className="relative flex h-fit w-full items-center rounded py-3">
            <div className="relative flex w-full flex-col justify-center px-4 py-1">
                <div className="flex select-none justify-start">
                    상태 메세지 변경
                </div>
                <button
                    type="button"
                    onClick={handleClick}
                    className="flex select-none flex-row justify-around text-base"
                >
                    {currentStatusMessage}
                    <Icon.Edit />
                </button>
            </div>
        </div>
    );
}
