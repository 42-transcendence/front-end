import { Icon } from "../Icon/Icon";

export default function Chat() {
    return (
        <div className="flex h-screen w-[370px] shrink-0 flex-col items-start p-4 backdrop-blur-[50px]">
            <div className="flex items-center justify-between self-stretch px-4 py-5">
                <Icon type="edit" size={40} className="" />
                hihi hoho
                <Icon type="friend" size={40} className="" />
            </div>
            {/* message */}
            <div className="flex flex-[1_0_0] flex-col items-center justify-end gap-2.5 self-stretch rounded-lg bg-slate-400 px-0 py-4">
                <div className="flex flex-[1_0_0] flex-col items-start self-stretch px-4 py-0">
                    here, message
                </div>
                <div className="mx-4 flex items-center self-stretch rounded-3xl bg-slate-600 px-5 py-2 shadow-[1px_1.5px_4px_0px_rgba(0,0,0,0.10)_inset,1px_1.5px_4px_0px_rgba(0,0,0,0.08)_inset,0px_-0.5px_1px_0px_rgba(255,255,255,0.25)_inset,0px_-0.5px_1px_0px_rgba(255,255,255,0.30)_inset]">
                    <input className="w-[265px] overflow-hidden text-ellipsis border-[none] bg-transparent text-[17px] font-normal not-italic leading-[22px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]"></input>
                    <button>
                        <Icon type="check" size={40} className="" />
                    </button>
                </div>
            </div>
        </div>
    );
}
