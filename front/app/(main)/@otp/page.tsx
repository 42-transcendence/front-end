import { OTPInputBlocks } from "./OTPInputBlocks";

export default function LoginPage() {
    return (
        <main>
            <div className="flex justify-center w-full h-[100dvh]">
                <div className="flex relative flex-col justify-center h-full">
                    <div className="flex flex-col gap-8 justify-center items-center p-16 py-32 backblur gradient-border h-fit w-fit rounded-[28px] bg-windowGlass/30 backdrop-blur-[50px] before:rounded-[28px] before:p-px">
                        <div>
                            <span className="flex flex-col justify-center w-96 h-10 text-3xl font-bold text-center text-white">
                                Verify your Number
                            </span>
                            <span className="flex flex-col justify-center self-stretch text-base not-italic font-bold text-center shrink-0 text-gray-50/70">
                                Open the authenticator and enter the number
                            </span>
                        </div>
                        <div className="flex gap-2 items-start">
                            <OTPInputBlocks length={6} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
