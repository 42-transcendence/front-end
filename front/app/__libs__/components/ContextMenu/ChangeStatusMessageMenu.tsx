import { useProtectedProfile } from "@hooks/useProfile";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { makeStatusMessageRequest } from "@akasha-utils/chat-payload-builder-client";
import { Icon } from "@components/ImageLibrary";
import { TextField } from "@components/TextField";
import { useState } from "react";

export function ChangeStatusMessageMenu({
    targetAccountUUID,
}: {
    targetAccountUUID: string;
}) {
    const { sendPayload } = useWebSocket("chat", []);
    const protectedProfile = useProtectedProfile(targetAccountUUID);
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isStatusMessageOpen, setIsStatusMessageOpen] = useState(false);

    const currentStatusMessage = protectedProfile?.statusMessage ?? "";

    const handleClick = () => {
        sendPayload(makeStatusMessageRequest(value));
        setIsOpen(false);
    };

    return (
        <div className="relative flex h-fit w-full items-center rounded">
            <div className="relative flex w-60 flex-col justify-start gap-2 px-2 py-2">
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setValue("");
                    }}
                >
                    <div className="flex w-fit select-none items-center justify-start gap-1 rounded p-2 px-2 hover:bg-primary/30 active:bg-secondary/70">
                        <Icon.Edit />
                        상태 메시지 변경
                    </div>
                </button>
                {isOpen ? (
                    <div className="flex flex-row gap-2">
                        <TextField
                            value={value}
                            onKeyDown={(event) =>
                                event.key === "Enter" && handleClick()
                            }
                            placeholder={currentStatusMessage}
                            onChange={(event) => setValue(event.target.value)}
                            required
                            className="peer w-full px-2"
                        />
                        <button
                            type="submit"
                            className="h-8 w-8 rounded bg-gray-500 p-2 peer-valid:bg-green-500/80"
                            onClick={handleClick}
                        >
                            <Icon.Arrow3 />
                        </button>
                    </div>
                ) : (
                    <span
                        onClick={() =>
                            setIsStatusMessageOpen(!isStatusMessageOpen)
                        }
                        className={`relative w-full ${
                            isStatusMessageOpen
                                ? "break-all"
                                : "overflow-hidden whitespace-nowrap transition-all ease-linear hover:-translate-x-[150%] hover:overflow-visible hover:delay-300 hover:duration-[5000ms]"
                        } px-2 text-gray-300/80`}
                    >
                        {currentStatusMessage}
                    </span>
                )}
            </div>
        </div>
    );
}
