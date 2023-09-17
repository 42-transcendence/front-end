"use client";

import { OTPToggleBlocks } from "@/app/(main)/@otp/OTPInputBlocks";
import { useGetInertOTP, useGetOTP } from "@hooks/useOTP";
import { OTP_AUTH_ISSUER } from "@utils/constants";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

export function OTPRegistration() {
    const otpEnabled = useGetOTP();

    if (otpEnabled === undefined) {
        return (
            <p className="loading w-full justify-start">
                정보를 불러오는 중입니다.
            </p>
        );
    }
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            {!otpEnabled && <QRCodeCanvas />}
            <p>
                {!otpEnabled
                    ? "OTP를 등록하려면 입력하세요"
                    : "OTP를 해제하려면 입력하세요"}
            </p>
            <div className="z-10 flex flex-row gap-2">
                <OTPToggleBlocks
                    key={otpEnabled.toString()}
                    length={6}
                    enable={!otpEnabled}
                />
            </div>
        </div>
    );
}

const BASE_URI = "otpauth://totp";

function QRCodeCanvas() {
    const { data } = useGetInertOTP();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const label = `${OTP_AUTH_ISSUER}`;
    const [uri, setURI] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            throw new Error();
        }

        if (data === undefined) {
            return;
        }

        const params = new URLSearchParams();
        params.set("secret", data.data);
        params.set("issuer", OTP_AUTH_ISSUER);
        params.set("algorithm", data.algorithm.replace("-", ""));
        params.set("digits", data.codeDigits.toString());
        params.set("period", data.movingPeriod.toString());

        const errorCallback = (e: Error | null | undefined) => {
            if (e instanceof Error) {
                alert(e.message);
            }
        };

        const uri = `${BASE_URI}/${label}?${params.toString()}`;

        QRCode.toCanvas(canvas, uri, errorCallback);
        setURI(uri);
    }, [data, label]);

    return (
        <button
            type="button"
            onClick={() => window.open(uri, "otp link window")}
            className="z-50 flex flex-col items-center justify-center gap-2"
        >
            <canvas ref={canvasRef} />
            <p>OTP 인증기에 위 코드를 등록하세요.</p>
        </button>
    );
}
