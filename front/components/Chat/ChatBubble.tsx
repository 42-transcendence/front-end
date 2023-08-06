import ChatBubbleTail from "/public/chat_bubble_tail.svg";
import ChatBubbleTailRight from "/public/chat_bubble_tail_right.svg";

export function ChatBubble({ children }: React.PropsWithChildren) {
    return (
        <div className="relative flex h-fit w-full flex-row pl-[11px] pt-[5px]">
            <ChatBubbleTail
                width="24"
                height="13"
                className="absolute left-0 top-0 text-primary"
            />
            <div className="static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs whitespace-normal rounded-xl bg-primary p-3 font-sans text-base font-normal text-gray-100/90">
                {children}
                asdf
            </div>
        </div>
    );
}

export function ChatBubbleRight({ children }: React.PropsWithChildren) {
    return (
        <div className="relative flex h-fit w-full flex-row-reverse pr-[11px] pt-[5px]">
            <ChatBubbleTailRight
                width="24"
                height="13"
                className="absolute right-0 top-0 text-secondary"
            />
            <div className="static h-fit min-h-[1rem] w-fit min-w-[3rem] max-w-xs whitespace-normal rounded-xl bg-secondary p-3 font-sans text-base font-normal text-gray-100/90">
                {children}
                asdf
            </div>
        </div>
    );
}
