"use client";

import { OTPToggleBlocks } from "@/app/(main)/@otp/OTPInputBlocks";
import { useGetInertOTP, useGetOTP } from "@hooks/useOTP";
import { OTP_AUTH_ISSUER } from "@utils/constants";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export function OTPRegistration() {
    const otpEnabled = useGetOTP();

    if (otpEnabled === undefined) {
        return <p>정보를 불러오는 중입니다...</p>;
    }
    return (
        <>
            {!otpEnabled && <QRCodeCanvas />}
            <p>
                {!otpEnabled
                    ? "OTP를 등록하려면 입력하세요"
                    : "OTP를 해제하려면 입력하세요"}
            </p>
            <OTPToggleBlocks
                key={otpEnabled.toString()}
                length={6}
                enable={!otpEnabled}
            />
        </>
    );
}

const BASE_URI = "otpauth://totp";

function QRCodeCanvas() {
    const { data } = useGetInertOTP();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const label = `${OTP_AUTH_ISSUER}`;

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
    }, [data, label]);

    // TODO: add tailwind css
    // TODO: Add link!!
    return (
        <div className="">
            <button type="button">
                <canvas ref={canvasRef} />
                <p>TOTP 인증기에 위 코드를 등록하고 OTP를 입력하세요.</p>
            </button>
        </div>
    );
}
