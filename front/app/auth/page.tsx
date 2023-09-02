"use client";

import { useAuthEnd } from "@/hooks/useAuthEnd";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
    const searchParams = useSearchParams();
    const success = useAuthEnd(searchParams);

    useEffect(() => {
        if (success === true) {
            window.close();
        }
    }, [success]);

    return (
        <p>
            {success !== undefined
                ? success
                    ? "로그인 성공!! 창을 닫아도 좋습니다."
                    : "로그인에 실패했습니다. 잠시후 다시 시도해주세요."
                : "로그인을 진행하는 중입니다. 잠시만 기다려 주세요..."}
        </p>
    );
}
