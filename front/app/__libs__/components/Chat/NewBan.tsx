import { useLayoutEffect, useRef, useState } from "react";
import { ProfileItemBase } from "@components/ProfileItem/ProfileItemBase";
import { Icon } from "@components/ImageLibrary";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";
import {
    makeKickMemberRequest,
    makeMuteMemberRequest,
} from "@akasha-utils/chat-payload-builder-client";

type ExpireDate = {
    key: string;
    value: number;
};

const expireDate: ExpireDate[] = [
    { key: "0분", value: 0 },
    { key: "1분", value: 60 },
    { key: "5분", value: 300 },
    { key: "10분", value: 600 },
    { key: "1시간", value: 3600 },
    { key: "1일", value: 86400 },
    { key: "1주", value: 604800 },
    { key: "1달", value: 2419200 },
    { key: "1년", value: 29030400 },
    { key: "1세기", value: 2903040000 },
];

function BanFormItem({ children }: React.PropsWithChildren) {
    return (
        <div className="flex w-full flex-col gap-2 text-sm font-bold text-gray-100">
            {children}
        </div>
    );
}

export function ReportUser({ accountUUID }: { accountUUID: string }) {
    //TODO; fetch from accountUUID
    const summary = "다음 유저를 신고합니다";
    const reasonTitle = "신고 사유";
    const ref = useRef<HTMLFormElement>(null!);
    const type = "report";
    const submitTitle = "신고하기";
    const { sendPayload } = useWebSocket("chat", []);
    const currentRoomUUID = useCurrentChatRoomUUID();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const data = new FormData(ref.current);
        console.log(data);
        // sendPayload(makeKickMemberRequest(currentRoomUUID, accountUUID, ));
    };

    return (
        <form
            ref={ref}
            id={type}
            onSubmit={handleSubmit}
            className="relative flex h-full w-full flex-col gap-4 overflow-hidden"
        >
            <div className="flex h-full w-full flex-col justify-start gap-4 overflow-auto">
                <BanFormItem>
                    {summary}
                    <ProfileItemBase accountUUID={accountUUID} />
                </BanFormItem>
                <BanFormItem>
                    {reasonTitle}
                    <MessageInputArea name="reason" form={type} />
                </BanFormItem>
            </div>
            <button className="h-8 w-full rounded bg-red-500 text-gray-50">
                {submitTitle}
            </button>
        </form>
    );
}

export function SendBan({ accountUUID }: { accountUUID: string }) {
    //TODO; fetch from accountUUID
    const summary = "다음 유저를 현재 채팅방에서 내보냅니다.";
    const expireDateTitle = "기간";
    const reasonTitle = "채팅 금지 사유";
    const memoTitle = "메모";
    const submitTitle = "채팅 금지하기";
    const ref = useRef<HTMLFormElement>(null!);
    const type = "send";
    const { sendPayload } = useWebSocket("chat", []);
    const currentRoomUUID = useCurrentChatRoomUUID();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const data = new FormData(ref.current);
        const expireDate = data.get("expireDate");
        const reason = data.get("reason");
        if (reason === null) {
            alert("금지 사유를 입력해주세요.");
            return;
        }
        const memo = data.get("memo");
        sendPayload(
            makeMuteMemberRequest(
                currentRoomUUID,
                accountUUID,
                reason as string,
                memo as string,
                parseInt(expireDate as string),
            ),
        );
    };

    return (
        <form
            ref={ref}
            id={type}
            onSubmit={handleSubmit}
            className="relative flex h-full w-full flex-col gap-4 overflow-hidden"
        >
            <div className="flex h-full w-full flex-col justify-start gap-4 overflow-auto">
                <BanFormItem>
                    {summary}
                    <ProfileItemBase accountUUID={accountUUID} />
                </BanFormItem>
                <BanFormItem>
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
                </BanFormItem>
                <BanFormItem>
                    {reasonTitle}
                    <MessageInputArea name="reason" form={type} required />
                </BanFormItem>
                <BanFormItem>
                    {memoTitle}
                    <MessageInputArea name="memo" form={type} />
                </BanFormItem>
            </div>
            <button className="h-8 w-full rounded bg-red-500 text-gray-50">
                {submitTitle}
            </button>
        </form>
    );
}

export function AccessBan({ accountUUID }: { accountUUID: string }) {
    //TODO; fetch from accountUUID
    const summary = "다음 유저를 채팅 금지 시킵니다";
    const expireDateTitle = "기간";
    const reasonTitle = "차단 사유";
    const memoTitle = "메모";
    const submitTitle = "차단하기";
    const ref = useRef<HTMLFormElement>(null!);
    const type = "access";
    const { sendPayload } = useWebSocket("chat", []);
    const currentRoomUUID = useCurrentChatRoomUUID();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const data = new FormData(ref.current);
        const expireDate = data.get("expireDate");
        const reason = data.get("reason");
        if (reason === null) {
            alert("금지 사유를 입력해주세요.");
            return;
        }
        const memo = data.get("memo");
        sendPayload(
            makeKickMemberRequest(
                currentRoomUUID,
                accountUUID,
                reason as string,
                memo as string,
                parseInt(expireDate as string),
            ),
        );
    };

    return (
        <form
            ref={ref}
            id={type}
            onSubmit={handleSubmit}
            className="relative flex h-full w-full flex-col gap-4 overflow-hidden"
        >
            <div className="flex h-full w-full flex-col justify-start gap-4 overflow-auto">
                <BanFormItem>
                    {summary}
                    <ProfileItemBase accountUUID={accountUUID} />
                </BanFormItem>
                <BanFormItem>
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
                </BanFormItem>
                <BanFormItem>
                    {reasonTitle}
                    <MessageInputArea name="reason" form={type} />
                </BanFormItem>
                <BanFormItem>
                    {memoTitle}
                    <MessageInputArea name="memo" form={type} />
                </BanFormItem>
            </div>
            <button className="h-8 w-full rounded bg-red-500 text-gray-50">
                {submitTitle}
            </button>
        </form>
    );
}

const MIN_TEXTAREA_HEIGHT = 128;

// TODO: NewBan와 별도로 분리할 수도 있는 컴포넌트같으므로 분리 혹은 기존 있는 다른 컴포넌트 재활용이 어떨까 합니다
function MessageInputArea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");

    useLayoutEffect(() => {
        const element = textareaRef.current;
        if (element === null) {
            throw new Error();
        }

        // Reset height - important to shrink on delete
        element.style.height = "inherit";
        // Set height
        element.style.height = `${Math.max(
            element.scrollHeight,
            MIN_TEXTAREA_HEIGHT,
        )}px`;
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

function ExpireDateItem({ id, content }: { id: string; content: ExpireDate }) {
    return (
        <label className="flex flex-row gap-2 p-1" htmlFor={id}>
            <input
                id={id}
                className="peer hidden"
                name="expireDate"
                type="radio"
                value={content.value}
            />
            <div className="hidden h-5 w-5 rounded-full bg-secondary/80 outline outline-1 outline-secondary peer-checked:flex">
                <Icon.Check className="h-5 w-5 p-1" />
            </div>
            <div className="h-5 w-5 rounded-full outline outline-1 outline-gray-300/50 peer-checked:hidden" />
            <span>{content.key}</span>
        </label>
    );
}
