"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function StartBegin({ params }: { params: { src: string } }) {
    const [status, setStatus] = useState<number>();
    const [redirectURI, setRedirectURI] = useState<string>();
    useEffect(() => {
        const url = new URL(`https://back.stri.dev/auth/${params.src}`);
        url.searchParams.set("redirect_uri", `${window.location.origin}/auth`);
        fetch(url).then((response) => {
            setStatus(response.status);
            if (response.ok) {
                response.text().then((text) => {
                    setRedirectURI(text);
                });
            }
        });
    }, [params]);

    if (redirectURI) {
        redirect(redirectURI);
    }

    return (
        <>
            <p>Authorization Source: {params.src}</p>
            <p>
                {status === undefined
                    ? "로딩..."
                    : status === 200
                        ? "당신은 이 메시지를 절대 볼 수 없습니다."
                        : `실패했습니다...? 왜지? ${status}`}
            </p>
            <br />
            <p>{redirectURI}</p>
        </>
    );
}
