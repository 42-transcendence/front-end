"use client";
import { FtLoginButton } from "@/components/LoginButton/42LoginButton";
import { GoogleLoginButton } from "@/components/LoginButton/GoogleLoginButton";
import DoubleSharp from "/public/doubleSharp.svg";

export default function LoginPage() {
    return (
        <main>
            <div className="relative flex h-screen w-screen flex-col items-center justify-center ">
                <div className="relative flex h-full items-end justify-center">
                    <DoubleSharp
                        className="relative h-fit w-fit animate-spin-slow text-black drop-shadow-[0_0_3rem_#00000050] delay-300 dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                        width={130}
                        height="100%"
                    />
                </div>
                <div className="relative flex h-[90%] w-fit flex-col items-center justify-center gap-1">
                    <GoogleLoginButton />
                    <FtLoginButton />
                </div>
            </div>
        </main>
    );
}
