import { OTPInputBlocks } from "./OTPInputBlocks";

export default function LoginPage() {
    return (
        <main>
            <div className="flex h-[100dvh] w-full justify-center">
                <div className="relative flex h-full flex-col justify-center">
                    <div className="backblur gradient-border flex h-fit w-fit flex-col items-center justify-center gap-8 rounded-[28px] bg-windowGlass/30 p-16 py-32 backdrop-blur-[50px] before:rounded-[28px] before:p-px">
                        <div>
                            <span className="flex h-10 w-96 flex-col justify-center text-center text-3xl font-bold text-white">
                                Verify your Number
                            </span>
                            <span className="flex shrink-0 flex-col justify-center self-stretch text-center text-base font-bold not-italic text-gray-50/70">
                                Open the authenticator and enter the number
                            </span>
                        </div>
                        <div className="z-10 flex items-start gap-2">
                            <OTPInputBlocks length={6} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
