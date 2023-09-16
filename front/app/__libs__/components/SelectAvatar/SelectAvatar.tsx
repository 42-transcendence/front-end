"use client";

import { Icon } from "@components/ImageLibrary";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ImageUploadBox } from "./ImageUploadBox";
import { useRefMap } from "@hooks/useRefMap";
import { ScrollBox } from "./ScrollBox";
import { useAvatarMutation } from "@hooks/useProfile";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";

const defaultAvatarsKey = ["jisookim", "iyun", "hdoo", "jkong", "chanhpar"];

function useFormData(): [
    setForm: React.Dispatch<React.SetStateAction<FormData | null>>,
    sendForm: () => void,
    clearForm: () => void,
] {
    const [formData, setForm] = useState<FormData | null>(null);
    const { trigger, error } = useAvatarMutation();

    const clearForm = useCallback(() => {
        setForm(new FormData());
    }, []);

    const sendForm = useCallback(() => {
        if (formData === null) {
            return;
        }
        void trigger(formData);
    }, [formData, trigger]);

    useEffect(() => {
        if (error) {
            alert("오류가 발생했습니다. 다시 시도해 주세요");
        }
    }, [error]);

    return [setForm, sendForm, clearForm];
}

function useImageAsFormData(): [
    image: HTMLImageElement | null,
    setImage: (image: HTMLImageElement) => void,
    sendForm: () => void,
] {
    const [setForm, sendForm, clearForm] = useFormData();
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

export function SelectAvatar() {
    const rootRef = useRef<HTMLDivElement>(null);
    const [targetRefsMap, refCallbackAt] = useRefMap<
        string,
        HTMLImageElement
    >();

    const observerOptions = useMemo(() => {
        return {
            root: rootRef.current,
            rootMargin: "0px",
            threshold: 1.0,
        };
    }, []);

    const [image, setImage, sendForm] = useImageAsFormData();

    useIntersectionObserver(
        (x: Element) => setImage(x as HTMLImageElement),
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
                            className={`${
                                image !== null && image.dataset["name"] === name
                                    ? "bg-black/30"
                                    : ""
                            } z-10 h-64 w-64 flex-shrink-0 snap-center snap-always overflow-hidden rounded-xl`}
                        >
                            <Image
                                ref={refCallbackAt(name)}
                                className="box-content"
                                src={`/${name}.png`}
                                alt={`${name}'s Avatar`}
                                data-name={name}
                                width={256}
                                height={256}
                                priority
                            />
                        </div>
                    ))}
                    <ImageUploadBox setImage={setImage} />
                </ScrollBox>
            </div>
            <p>현재 아바타: {image !== null && image.dataset["name"]}</p>
            <button className="z-50" type="button" onClick={() => sendForm()}>
                <Icon.Arrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </button>
        </>
    );
}
