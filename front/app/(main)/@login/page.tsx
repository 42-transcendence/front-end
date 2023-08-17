"use client";

import { SquareButton } from "@/components/Button/SquareButton";
import { DoubleSharp, Logo42, LogoGoogle } from "@/components/ImageLibrary";

const popupFeatures = ["popup=true", "width=600", "height=600"].join(",");
const loginList = [
    {
        key: "intra42",
        logo: <Logo42 width={17} height="100%" />,
        action: () => {
            window.open("/auth/intra42", "42 Login", popupFeatures);
        },
        innerText: "Sign in with 42",
    },
    {
        key: "google",
        logo: <LogoGoogle width={17} height="100%" />,
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
                        className="relative h-fit w-fit animate-spin-slow text-white drop-shadow-[0_0_0.3rem_#ffffff70] delay-300"
                        width={130}
                        height="100%"
                    />
                </div>
                <div className="relative flex h-[90%] w-fit flex-col items-center justify-center gap-1">
                    {loginList.map((e) => (
                        <SquareButton
                            key={e.key}
                            onClick={e.action}
                            icon={e.logo}
                        >
                            {e.innerText}
                        </SquareButton>
                    ))}
                </div>
            </div>
        </main>
    );
}
