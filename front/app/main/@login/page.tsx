"use client";

import { LoginButton } from "@/components/Button/LoginButton";
import DoubleSharp from "/public/doubleSharp.svg";
import FtLogo from "/public/42logo.svg";
import GoogleLogo from "/public/googleLogo.svg";

const popupFeatures = ["popup=true", "width=600", "height=600"].join(",");
const loginList = [
    {
        key: "42",
        logo: <FtLogo width={17} height="100%" />,
        action: () => {
            window.open("/auth/42", "42 Login", popupFeatures);
        },
        innerText: "Sign in with 42",
    },
    {
        key: "google",
        logo: <GoogleLogo width={17} height="100%" />,
        action: () => {
            window.open("/auth/google", "Google Login", popupFeatures);
        },
        innerText: "Sign in with Google",
    },
];

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
                    {loginList.map((e) => (
                        <LoginButton
                            key={e.key}
                            onClick={e.action}
                            icon={e.logo}
                        >
                            {e.innerText}
                        </LoginButton>
                    ))}
                </div>
            </div>
        </main>
    );
}
