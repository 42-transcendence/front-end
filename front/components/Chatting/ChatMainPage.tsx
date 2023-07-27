import { Icon } from "../Icon/Icon";

export default function ChatMainPage() {
    return (
        <div>
            <div className="flex h-screen w-screen rounded-[28px_28px_0px_0px] pb-0 pl-[11px] pr-0 pt-[5px] backdrop-blur-[50px]">
                <div className="float-left flex-auto ">
                    <div className="m-6 flex justify-between self-stretch ">
                        <button>
                            <Icon
                                type="sidebar"
                                size={20}
                                className="float-left flex"
                            />
                        </button>
                        <div className="flex items-center justify-center gap-2.5 text-base backdrop-blur-[50px]">
                            <div className="flex flex-col items-center justify-center px-4 py-0">
                                <div className="text-center text-[17px] font-bold not-italic leading-[18px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                                    chatting room
                                </div>
                                <div className="overflow-hidden text-ellipsis text-center text-xs font-medium not-italic leading-[normal] text-[color:var(--text-tertiary,rgba(255,255,255,0.11))]">
                                    채팅을 채팅채팅~
                                </div>
                            </div>
                        </div>
                        <button>
                            <Icon
                                type="friend"
                                size={40}
                                className="float flex"
                            />
                        </button>
                    </div>
                    <div className="mr-3 flex h-screen items-end self-stretch rounded-lg bg-slate-400 p-4"></div>
                </div>
            </div>
        </div>
    );
}
