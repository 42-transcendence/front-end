import React from "react";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { SocialButton } from "./SocialButton";
import { DoubleSharp } from "../ImageLibrary";

export function NavigationBar() {
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
        <div className="relative flex h-fit w-full flex-row items-center justify-between bg-primary/30 p-2 backdrop-blur-[20px] backdrop-brightness-100">
            <Link className="relative" href="/">
                <DoubleSharp
                    className="w-12 p-2 text-white drop-shadow-[0_0_0.3rem_#ffffff70]"
                    width="100%"
                    height="100%"
                />
            </Link>
            <div className="relative flex flex-row items-center justify-between gap-4">
                <SocialButton />
                {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                <Avatar
                    // avatarKey={account?.avatarKey}
                    accountUUID={"jkong"}
                    className="relative h-9 w-9 bg-white/30"
                />
            </div>
        </div>
    );
}
//
