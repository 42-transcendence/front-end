/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Avatar } from "../Avatar";
import { SocialButton } from "./SocialButton";
import { DoubleSharp } from "../ImageLibrary";

export async function NavigationBar() {
    // TODO: fetch account data.
    // const token = cookies().get("at")?.value;
    // console.log(token);
    // const account = token
    //     ? await fetch("https://back.stri.dev/auth/get-account", {
    //           headers: { Authorization: `Bearer ${token}` },
    //       }).then((e) => e.json())
    //     : undefined;
    // console.log(account);

    return (
        <div className="relative flex h-12 w-full flex-row items-center justify-between bg-primary/30 px-5 py-2.5 backdrop-blur-[20px] backdrop-brightness-100 2xl:h-16">
            <Link className="relative" href="/main">
                <DoubleSharp
                    className="text-white drop-shadow-[0_0_0.3rem_#ffffff70]"
                    width={32}
                    height="100%"
                />
            </Link>
            <div className="relative flex flex-row items-center justify-between gap-4 ">
                <SocialButton />
                {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                <Avatar
                    size={"w-10 h-10"}
                    // avatarKey={account?.avatarKey}
                    avatarKey={"jkong"}
                    className="relative bg-white/30"
                />
            </div>
        </div>
    );
}
//
