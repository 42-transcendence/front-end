import QRCode from "qrcode";
import { useEffect, useRef } from "react";

type OTPAuthAlgorithm = "SHA1" | "SHA256" | "SHA512";
type Base64String = string & { __base32__: never };

type AuthInfo = {
    algorithm: OTPAuthAlgorithm;
    secret: Base64String;
    issuer: string;
    subject: string;
};

const authInfo = {
    algorithm: "SHA-512" as OTPAuthAlgorithm,
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
        uri.searchParams.set("algorithm", authInfo.algorithm);
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

export const TestQR = <QRCodeCanvas authInfo={authInfo} />;
