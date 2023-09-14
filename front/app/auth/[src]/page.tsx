"use client";

import { useAuthBegin } from "@hooks/useAuthBegin";
import { redirect } from "next/navigation";

export default function StartBegin({ params }: { params: { src: string } }) {
    const redirectURI = useAuthBegin(params.src, "/auth");

    if (redirectURI !== undefined) {
        redirect(redirectURI);
    }

    return <p className="loading">로그인 화면으로 이동 중입니다</p>;
}
