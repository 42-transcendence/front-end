"use client";

import { Icon } from "@/components/ImageLibrary";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { UploadBox } from "./UploadBox";
import { useRefMap } from "@/hooks/useRefMap";

const defaultProfilesKey = ["jisookim", "iyun", "hdoo", "jkong", "chanhpar"];

export function SelectAvatar() {
    const [profileName, setProfileName] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const [targetRefsMap, refCallbackAt] = useRefMap<string, HTMLImageElement>();
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
            if (target instanceof HTMLElement) {
                setProfileName(target.dataset["name"] ?? "");
            }
        },
        [],
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
                    />
                    <div className="shrink-0 snap-center">
                        <div className="w-7 shrink-0"></div>
                    </div>
                </div>
            </div>
            {/* TODO: if file select, change message to file select.*/}
            <p>selected profile: {profileName}</p>

            {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
            <Icon.Arrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
        </>
    );
}
