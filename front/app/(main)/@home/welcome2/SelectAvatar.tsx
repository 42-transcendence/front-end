"use client";

import { Icon } from "@/components/ImageLibrary";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { UploadBox } from "./UploadBox";
import { useRefMap } from "@/hooks/useRefMap";

const defaultProfilesKey = ["jisookim", "iyun", "hdoo", "jkong", "chanhpar"];

// FIXME: change to jotai atom
function useAccessToken() {
    const accessToken: string | null =
        window.localStorage.getItem("access_token");
    if (accessToken === null) {
        throw new Error("너 액세스 토큰 없음 ㅋㅋ");
    }
    return accessToken;
}

function useFormData(method: "POST" | "GET", url: string | URL): [
    setFormData: (key: string, data: string | Blob | (string | Blob)[]) => void,
    sendFormData: () => void,
] {
    const formData = useRef(new FormData()); // useState or useRef 같은거 써야하나?
    const accessToken = useAccessToken();

    const options = {
        method: method,
        body: formData.current,
        headers: {
            Authorization: ["Bearer", accessToken].join(" "),
        },
    }

    const setFormData = (key: string, data: string | Blob | (string | Blob)[]) => {
        formData.current.delete(key);
        if (Array.isArray(data)) {
            data.forEach((x) => formData.current.append(key, x));
        }
        else {
            formData.current.set(key, data);
        }
    }
    const sendFormData = () => {
        fetch(url, options)
            .then((res) => { console.log(res) }) // TODO: 받아서 어떻게 해야하지???
            .catch((e) => { console.log(e) })
    }

    return [setFormData, sendFormData];
}

export function SelectAvatar() {
    const [profileName, setProfileName] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const [targetRefsMap, refCallbackAt] = useRefMap<
        string,
        HTMLImageElement
    >();

    const [setFormData, sendFormData] = useFormData("POST", "https://back.stri.dev/profile/avatar");

    const formDataKey = "profile-avatar"; // TODO: rename

    const observerOptions = useMemo(
        () => ({
            root: rootRef.current,
            rootMargin: "0px",
            threshold: 1.0,
        }),
        [],
    );

    const handleIntersect = useCallback(
        (
            entries: IntersectionObserverEntry[],
            _observer: IntersectionObserver,
        ) => {
            const entry = entries.find((e) => e.isIntersecting);
            if (entry === undefined) {
                return;
            }

            const target = entry.target;
            if (target instanceof HTMLImageElement) {
                setProfileName(target.dataset["name"] ?? "");

                // TODO: 함수 분리하기.... file 직접 upload하는 거랑 공통으로 쓸 수 있게
                // HTMLImageElement -> HTMLCanvasElement -> Blob -> FormData
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")
                if (ctx === null) {
                    return;
                }
                ctx.drawImage(target, 0, 0)
                canvas.toBlob((blob) => {
                    if (blob !== null) {
                        setFormData(formDataKey, blob)
                    }
                })
            }
        },
        [setFormData],
    );

    const observer = useMemo(
        () => new IntersectionObserver(handleIntersect, observerOptions),
        [handleIntersect, observerOptions],
    );

    useEffect(() => {
        if (rootRef.current === null) {
            return;
        }

        targetRefsMap.forEach((e) => observer.observe(e));

        return () => observer.disconnect();
    }, [observer, targetRefsMap]);

    return (
        <>
            <div className="z-10 w-[24rem] overflow-clip">
                <div
                    ref={rootRef}
                    className="z-20 flex snap-x snap-mandatory flex-row gap-5 overflow-auto pb-10"
                >
                    <div className="shrink-0 snap-center">
                        <div className="w-7 shrink-0"></div>
                    </div>
                    {defaultProfilesKey.map((name) => (
                        <div
                            key={name}
                            className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden"
                        >
                            {/* TODO: priority 설정 https://nextjs.org/docs/app/api-reference/components/image#priority */}
                            <Image
                                ref={refCallbackAt(name)}
                                className="box-content"
                                src={`/${name}.png`}
                                alt={`${name}'s Avatar`}
                                data-name={name}
                                width="250"
                                height="250"
                            />
                        </div>
                    ))}
                    {/* TODO: appropriate file size limit? */}
                    <UploadBox
                        accept="image/*"
                        maxFileCount={1}
                        maxFileSize={4096576}
                        previewImage={true}
                        setFormData={setFormData}
                    />
                    <div className="shrink-0 snap-center">
                        <div className="w-7 shrink-0"></div>
                    </div>
                </div>
            </div>
            {/* TODO: if file select, change message to file select.*/}
            <p>selected profile: {profileName}</p>

            {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
            <button className="z-50" type="button" onClick={() => sendFormData()}>
                <Icon.Arrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </button>
        </>
    );
}
