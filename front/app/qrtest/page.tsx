import { GenerateQRButton } from "@components/QRCodeCanvas";
import { OTPInputBlocks } from "../(main)/@otp/OTPInputBlocks";

export default function QRButtonPage() {
    return (
        <div>
            <GenerateQRButton />
            <div className="flex flex-row">
                <OTPInputBlocks length={6} />
            </div>
        </div>
    );
}
