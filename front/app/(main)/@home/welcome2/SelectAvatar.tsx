"use client";

import { Icon } from "@/components/ImageLibrary";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ImageUploadBox } from "./ImageUploadBox";
import { useRefMap } from "@/hooks/useRefMap";
import { useAtomValue } from "jotai";
import { AccessTokenAtom } from "@/atom/AccountAtom";
import { ScrollBox } from "./ScrollBox";

const defaultAvatarsKey = ["jisookim", "iyun", "hdoo", "jkong", "chanhpar"];

function useFormData(
    url: string | URL,
): [
    setForm: React.Dispatch<React.SetStateAction<FormData | null>>,
    sendForm: () => void,
    clearForm: () => void,
] {
    const [formData, setForm] = useState<FormData | null>(null);

    const accessToken = useAtomValue(AccessTokenAtom);

    const options = useMemo(() => {
        return {
            method: "POST",
            body: formData,
            headers: {
                Authorization: ["Bearer", accessToken].join(" "),
            },
        };
    }, [accessToken, formData]);

    const clearForm = useCallback(() => {
        setForm(new FormData());
    }, []);

    const sendForm = useCallback(() => {
        fetch(url, options)
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [options, url]);

    return [setForm, sendForm, clearForm];
}

function useImageAsFormData(): [
    image: HTMLImageElement | null,
    setImage: (image: HTMLImageElement) => void,
    sendForm: () => void,
] {
    const url = "https://back.stri.dev/profile/avatar";
    const [setForm, sendForm, clearForm] = useFormData(url);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const formDataKey = "avatar";

    useEffect(() => {
        if (image === null) {
            clearForm();
            return;
        }
    }, [clearForm, image]);

    const makeNewForm = (key: string, value: string | Blob) => {
        const newForm = new FormData();
        newForm.set(key, value);
        return newForm;
    };

    useEffect(() => {
        if (image === null) {
            return;
        }
        const canvas = document.createElement("canvas");
        // FIXME: 왜 이미지 잘림 왜안됨
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
            if (blob === null) {
                return;
            }
            setForm(makeNewForm(formDataKey, blob));
        }, "image/webp");
    }, [image, setForm]);

    return [image, setImage, sendForm];
}

function useIntersectionObserver(
    callback: (target: Element) => void,
    targets: Map<string, Element> | Set<Element> | Element[],
    observerOptions: IntersectionObserverInit,
) {
    const handleIntersect = useCallback(
        (
            entries: IntersectionObserverEntry[],
            _observer: IntersectionObserver,
        ) => {
            entries
                .filter((entry) => entry.isIntersecting)
                .forEach((entry) => callback(entry.target));
        },
        [callback],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            handleIntersect,
            observerOptions,
        );

        for (const target of targets.values()) {
            observer.observe(target);
        }

        return () => observer.disconnect();
    }, [handleIntersect, observerOptions, targets]);
}

export function SelectAvatar() {
    const rootRef = useRef<HTMLDivElement>(null);
    const [targetRefsMap, refCallbackAt] = useRefMap<
        string,
        HTMLImageElement
    >();

    // TODO: appropriate file size limit?
    const maxFileSize = 4096576;

    const observerOptions = useMemo(() => {
        return {
            root: rootRef.current,
            rootMargin: "0px",
            threshold: 1.0,
        };
    }, []);

    const [image, setImage, sendForm] = useImageAsFormData();

    useIntersectionObserver(
        (x: Element) => setImage(x as HTMLImageElement), // TODO: 이게 맞나??
        targetRefsMap,
        observerOptions,
    );

    return (
        <>
            <div ref={rootRef} className="z-10 w-[24rem] overflow-clip">
                <ScrollBox>
                    {defaultAvatarsKey.map((name) => (
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
                                priority
                            />
                        </div>
                    ))}
                    <ImageUploadBox
                        setImage={setImage}
                        maxFileSize={maxFileSize}
                    />
                </ScrollBox>
            </div>
            <p>현재 아바타: {image !== null && image.dataset["name"]}</p>
            <button className="z-50" type="button" onClick={() => sendForm()}>
                <Icon.Arrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </button>
        </>
    );
}
