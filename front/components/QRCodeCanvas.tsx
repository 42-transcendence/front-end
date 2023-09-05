import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
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
    const digits = 6;
    const period = 30;

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
            alert(e?.message);
        };

        QRCode.toCanvas(canvas, uri.toString(), errorCallback);
    }, [
        authInfo.algorithm,
        authInfo.issuer,
        authInfo.secret,
        authInfo.subject,
    ]);

    return (
        <div className="">
            <canvas ref={canvasRef} />
        </div>
    );
}

export function GenerateQRButton() {
    const [open, setOpen] = useState(false);

    const handleClick = () => setOpen(!open);

    return (
        <>
            <button className="" type="button" onClick={handleClick} />
            {open && <QRCodeCanvas authInfo={authInfo} />}
        </>
    );
}
