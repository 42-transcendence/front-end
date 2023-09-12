"use client";

import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
// import { Dialog } from "@headlessui/react";

type Base32String = string & { __base32__: never };

export type OTPAuthInfo = {
    data: Base32String;
    algorithm: "SHA256";
    codeDigits: number;
    movingPeriod: number;
};

const authInfo = {
    data: "ZGVlcF9kYXJrX3NlY3JldA==" as Base32String,
    algorithm: "SHA256" as const,
    codeDigits: 6,
    movingPeriod: 30,
};

export function QRCodeCanvas({ authInfo }: { authInfo: OTPAuthInfo }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const [uri, setURI] = useState("");
    const issuer = "doublesharp";
    const subject = "2fa";

    // TODO: 이러면 되나...? nextjs문서에서 외부 링크는 router.push말고 그냥 window location쓰래서 이렇게 해놨습니다 일단
    const handleClick = useCallback(() => {
        router.push(uri);
    }, [router, uri]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            throw new Error();
        }

        const uri = new URL("otpauth://");
        uri.hostname = "totp";
        uri.pathname = `${issuer}:${subject}`;
        uri.searchParams.set("secret", authInfo.data);
        uri.searchParams.set("issuer", issuer);
        uri.searchParams.set("algorithm", "SHA256");
        uri.searchParams.set("digits", authInfo.codeDigits.toString());
        uri.searchParams.set("period", authInfo.movingPeriod.toString());

        const errorCallback = (e: Error | null | undefined) => {
            if (e instanceof Error) {
                alert(e.message);
            }
        };

        QRCode.toCanvas(canvas, uri.toString(), errorCallback);
        setURI(uri.toString());
    }, [authInfo.codeDigits, authInfo.data, authInfo.movingPeriod]);

    // TODO: add tailwind css
    // TODO: Add link!!
    return (
        <div className="">
            <button type="button" onClick={handleClick}>
                <canvas ref={canvasRef} />
                <p>위 QR코드를 스캔하거나 클릭해 주세요</p>
            </button>
        </div>
    );
}

export const ExampleQR = () => <QRCodeCanvas authInfo={authInfo} />;

const popupFeatures = ["popup=true", "width=600", "height=600"].join(",");
export function GenerateQRButton() {
    const handleClick = () =>
        window.open("/qrtest/code", "qr code", popupFeatures);

    // TODO: add tailwind css
    return (
        <button className="" type="button" onClick={handleClick}>
            press!
        </button>
    );
}
