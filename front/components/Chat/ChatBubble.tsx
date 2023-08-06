import ChatBubbleTail from "/public/chat_bubble_tail.svg";

export function ChatBubble({ children }: React.PropsWithChildren) {
    return (
        <div className="relative max-w-xs">
            <ChatBubbleTail
                width="24"
                height="13"
                className="absolute left-0 top-0 text-primary"
            />
            <div className="absolute left-[11px] top-[5px] h-fit min-h-[1rem] w-fit min-w-[3rem] rounded-xl bg-primary p-3 font-sans text-base font-normal text-gray-100/90">
                asdfasdfasdlfkj asdfasdfasdlfkj asdfasdfasdlfkj asdfasdfasdlfkj
                asdfasdfasdlfkj asdfasdfasdlfkj asdfasdfasdlfkj asdfasdfasdlfkj
                asdfasdfasdlfkj asdfasdfasdlfkj
                {children}
            </div>
        </div>
    );
}
