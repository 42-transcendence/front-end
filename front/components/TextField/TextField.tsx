import React from "react";
import SearchIcon from "/public/search.svg";

export const TextField = ({}): JSX.Element => {
    return (
        <div className="shadow-3xl flex h-8 shrink-0 items-center gap-2 self-stretch rounded-xl bg-black/30 px-2 py-0">
            <div className="flex h-8 w-[305px] shrink-0 items-center gap-2 self-stretch rounded-xl px-2 py-0 ">
                {/* <Icon className="float-left" type="search" size={30} /> */}
                <div className="flex-[1_0_0] overflow-hidden text-ellipsis text-sm font-normal not-italic leading-[22px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                    <input className="w-[260px] border-[none] bg-transparent outline-none"></input>
                </div>
                <button>
                    <SearchIcon
                        className="text-gray-50"
                        width={20}
                        height="100%"
                    />
                </button>
            </div>
        </div>
    );
};
