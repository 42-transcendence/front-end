"use client";

import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
// import { Dialog } from "@headlessui/react";

type Base64String = string & { __base32__: never };

type AuthInfo = {
    secret: Base64String;
    issuer: string;
    subject: string;
};

const authInfo = {
    secret: "ZGVlcF9kYXJrX3NlY3JldA==" as Base64String,
    issuer: "doublesharp",
    subject: "test-oauth",
};

export function QRCodeCanvas({ authInfo }: { authInfo: AuthInfo }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const [uri, setURI] = useState("");
    const digits = 6;
    const period = 30;

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
        uri.pathname = `${authInfo.issuer}:${authInfo.subject}`;
        uri.searchParams.set("secret", authInfo.secret);
        uri.searchParams.set("issuer", authInfo.issuer);
        uri.searchParams.set("algorithm", "SHA-512");
        uri.searchParams.set("digits", digits.toString());
        uri.searchParams.set("period", period.toString());

        const errorCallback = (e: Error | null | undefined) => {
            if (e instanceof Error) {
                alert(e.message);
            }
        };

        QRCode.toCanvas(canvas, uri.toString(), errorCallback);
        setURI(uri.toString());
    }, [authInfo.issuer, authInfo.secret, authInfo.subject]);

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
