import React from "react";
import SearchIcon from "/public/search.svg";

import { useState } from "react";
import { FzfHighlight, useFzf } from "react-fzf";
import { chatRoomsDummy } from "../Chat/ChatSideBar";

function SearchField() {
    const [query, setQuery] = useState("");

    const { results, getFzfHighlightProps } = useFzf({
        items: chatRoomsDummy,
        itemToString(item) {
            return item.title ?? "";
        },
        limit: 5,
        query,
    });

    return (
        <>
            <div className="flex h-fit flex-col justify-start gap-2 overflow-hidden text-ellipsis text-sm font-normal not-italic leading-[22px] text-gray-200/90">
                <input
                    className="border-[none] bg-transparent outline-none"
                    type="text"
                    placeholder="Filter…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                    <ul className="relative">
                        {results.map((item, index) => (
                            <li key={item.title}>
                                <FzfHighlight
                                    {...getFzfHighlightProps({
                                        item,
                                        index,
                                        className: "text-secondary",
                                    })}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

export function SearchBox({}): React.ReactElement {
    return (
        <div className="shadow-3xl relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30 px-2 py-[5px]">
            <div className="relative flex h-fit shrink-0 items-center justify-start gap-2 self-stretch rounded-xl px-2 py-0 ">
                {/* <Icon className="float-left" type="search" size={30} /> */}
                <SearchField />
            </div>
            <button>
                <SearchIcon className="text-gray-50" width={20} height="100%" />
            </button>
        </div>
    );
}
