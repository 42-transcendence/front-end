import {
    FormEventHandler,
    TextareaHTMLAttributes,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { ProfileItemBase } from "../ProfileItem/ProfileItembase";
import { TextField } from "../TextField";
import { IconCheck } from "../ImageLibrary";

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
    const submitTitle = "차단하기";
    const ref = useRef<HTMLFormElement>(null!);
    const type = "access";

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const data = new FormData(ref.current);
        const value = Object.fromEntries(data.entries());

        console.log(value);
    };

    return (
        <form
            ref={ref}
            id={type}
            onSubmit={handleSubmit}
            className="relative flex h-full w-full flex-col gap-4 overflow-hidden"
        >
            <div className="flex h-full w-full flex-col justify-start gap-4 overflow-auto">
                <p className="w-full text-sm font-bold text-gray-100">
                    {summary}
                    <ProfileItemBase />
                </p>
                <div className="w-full text-sm font-bold text-gray-100">
                    {expireDateTitle}
                    <div className="flex h-fit w-full flex-col justify-start">
                        {expireDate.map((period, index) => {
                            return (
                                <ExpireDateItem
                                    key={index}
                                    id={index.toString()}
                                    content={period}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="flex w-full flex-col gap-2 text-sm font-bold text-gray-100">
                    {reasonTitle}
                    <MessageInputArea name="reason" form={type} />
                </div>
                <div className="flex w-full flex-col gap-2 text-sm font-bold text-gray-100">
                    {memoTitle}
                    <MessageInputArea name="memo" form={type} />
                </div>
            </div>
            <button className="h-8 w-full rounded bg-red-500 text-gray-50">
                {submitTitle}
            </button>
        </form>
    );
}

const MIN_TEXTAREA_HEIGHT = 128;

function MessageInputArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
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
        <textarea
            onChange={(event) => setValue(event.target.value)}
            rows={5}
            ref={textareaRef}
            style={{
                minHeight: MIN_TEXTAREA_HEIGHT,
                resize: "none",
            }}
            value={value}
            className="relative w-full flex-grow resize-none overflow-hidden rounded bg-black/30 p-2 font-sans text-base font-light text-white/80 outline-none focus:ring-0 focus-visible:ring-0"
            {...props}
        />
    );
}

function ExpireDateItem({ id, content }: { id: string; content: string }) {
    return (
        <label className="flex flex-row gap-2 p-1" htmlFor={id}>
            <input
                id={id}
                className="peer hidden"
                name="expireDate"
                type="radio"
                value={content}
            />
            <div className="hidden h-5 w-5 rounded-full bg-secondary/80 outline outline-1 outline-secondary peer-checked:flex">
                <IconCheck className="h-5 w-5 p-1" />
            </div>
            <div className="h-5 w-5 rounded-full outline outline-1 outline-gray-300/50 peer-checked:hidden" />
            <span>{content}</span>
        </label>
    );
}
