"use client";
import React from "react";
import { useState } from "react";
import { Icon } from "../Icon/Icon";

// //TODO change contents with query data.
// const profiles: ProfileItemConfig[] = [
//     {
//         id: 1,
//         name: "hdoo",
//         tag: "#00001",
//         statusMessage: "Hello world!",
//         showStatusMessage: true,
//     },
//     {
//         id: 2,
//         name: "chanhpar",
//         tag: "#00002",
//         statusMessage: "I'm chanhpar",
//         showStatusMessage: true,
//     },
//     {
//         id: 3,
//         name: "iyun",
//         tag: "#00003",
//         statusMessage: "I'm IU",
//         showStatusMessage: true,
//     },
//     {
//         id: 4,
//         name: "jkong",
//         tag: "#00004",
//         statusMessage: "I'm Jkong!",
//         showStatusMessage: true,
//     },
//     {
//         id: 5,
//         name: "jisookim",
//         tag: "#00005",
//         statusMessage: "Hi I'm jisoo",
//         showStatusMessage: true,
//     },
// ];

export function SideBar(): React.ReactElement {
    const [selectedId, setSelectedId] = useState<number>();
    //TODO: fetch profile datas

    return (
        <div className="gradient-border before:pointer-elvents-none relative flex h-80 w-[262px] flex-col items-start rounded-r-[28px] bg-windowGlass/30 p-4 backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded-r-[28px] before:p-px before:content-[''] ">
            <div className="flex h-16 shrink-0 items-center justify-between self-stretch px-2 py-4">
                <div className="flex w-fit items-center gap-2 self-stretch rounded-md">
                    <Icon type="edit" size={20} className="" />
                    <p className=" font-sans font-normal leading-4 text-gray-50 ">
                        New Chat Room
                    </p>
                </div>
                <Icon type="sidebar" size={20} className="" />
            </div>
        </div>
    );
}
