"use client";

import type { OTPSecret } from "@common/auth-payloads";
import { OTP_AUTH_ISSUER } from "@utils/constants";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

const BASE_URI = "otpauth://totp";

export function QRCodeCanvas({ authInfo }: { authInfo: OTPSecret }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const label = `${OTP_AUTH_ISSUER}`;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            throw new Error();
        }

        const params = new URLSearchParams();
        params.set("secret", authInfo.data);
        params.set("issuer", OTP_AUTH_ISSUER);
        params.set("algorithm", authInfo.algorithm.replace("-", ""));
        params.set("digits", authInfo.codeDigits.toString());
        params.set("period", authInfo.movingPeriod.toString());

        const errorCallback = (e: Error | null | undefined) => {
            if (e instanceof Error) {
                alert(e.message);
            }
        };

        const uri = `${BASE_URI}/${label}?${params.toString()}`;

        QRCode.toCanvas(canvas, uri, errorCallback);
    }, [authInfo, label]);

    // TODO: add tailwind css
    // TODO: Add link!!
    return (
        <div className="">
            <button type="button">
                <canvas ref={canvasRef} />
                <p>위 QR코드를 authenticator로 스캔하거나 클릭해 주세요</p>
            </button>
        </div>
    );
}
