"use client";

import { LoginButton } from "@/components/Button/LoginButton";
import DoubleSharp from "/public/doubleSharp.svg";
import FtLogo from "/public/42logo.svg";
import GoogleLogo from "/public/googleLogo.svg";

function popup42Login() {
    const url = new URL("https://front.stri.dev/auth/42");
    const target = "42 Login";
    const features = ["popup=true", "width=600", "height=600"].join(",");
    window.open(url, target, features);
}

function popupGoogleLogin() {
    const url = new URL("https://front.stri.dev/auth/google");
    const target = "Google Login";
    const features = ["popup=true", "width=600", "height=600"].join(",");
    window.open(url, target, features);
}

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
                    <LoginButton
                        onClick={popup42Login}
                        icon={<FtLogo width={17} height="100%" />}
                    >
                        Sign in with 42
                    </LoginButton>
                    <LoginButton
                        onClick={popupGoogleLogin}
                        icon={<GoogleLogo width={17} height="100%" />}
                    >
                        Sign in with Google
                    </LoginButton>
                </div>
            </div>
        </main>
    );
}
