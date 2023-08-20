import { useLayoutEffect, useRef, useState } from "react";
import { ProfileItemBase } from "../ProfileItem/ProfileItembase";
import { TextField } from "../TextField";

const configMockup = {
    id: 123,
    uuid: "123",
    tag: "#123",
    name: "hdoo",
    statusMessage: "nothion",
};

const expireDate = [
    "0분",
    "1분",
    "5분",
    "10분",
    "1시간",
    "1일",
    "1주",
    "1달",
    "1년",
    "1세기",
];

export function AccessBan({ uuid }: { uuid: string }) {
    //TODO; fetch from uuid
    void uuid;
    const summary = "다음 유저를 현재 채팅방에서 내보냅니다.";
    const expireDateTitle = "기간";
    const reasonTitle = "차단 사유";
    const memoTitle = "메모";

    return (
        <div className="flex h-full w-full flex-col justify-start gap-1 ">
            <p className="w-fit text-sm font-bold text-gray-100">{summary}</p>
            <ProfileItemBase />{" "}
            <p className="w-fit text-sm font-bold text-gray-100">
                {expireDateTitle}
                <label> </label>
                <input id="expireDate" type="radio" />
            </p>
            <p className="w-full text-sm font-bold text-gray-100">
                {reasonTitle}
                <MessageInputArea />
            </p>
            <p className="w-full text-sm font-bold text-gray-100">
                {memoTitle}
                <TextField className="h-32 w-full" />
            </p>
        </div>
    );
}

const MIN_TEXTAREA_HEIGHT = 32;

function MessageInputArea() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");

    useLayoutEffect(() => {
        const element = textareaRef.current;

        if (element) {
            // Reset height - important to shrink on delete
            element.style.height = "inherit";
            // Set height
            element.style.height = `${Math.max(
                element.scrollHeight,
                MIN_TEXTAREA_HEIGHT,
            )}px`;
        }
    }, [value]);

    return (
        <>
            <textarea
                onChange={(event) => setValue(event.target.value)}
                rows={1}
                // autoFocus={true}
                ref={textareaRef}
                placeholder="Send a message"
                style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                }}
                value={value}
                className="relative h-6 max-h-20 min-h-fit w-full flex-grow resize-none overflow-hidden bg-transparent font-sans text-base font-light text-white/80 outline-none focus:ring-0 focus-visible:ring-0"
            />
        </>
    );
}
