"use client";

import { DoubleSharp, IconArrow3 } from "@/components/ImageLibrary";
import { Card } from "@/components/Card/Card";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { UploadBox } from "./UploadBox";

const defaultProfilesKey = ["jisookim", "iyun", "hdoo", "jkong", "chanhpar"];

export default function Welcome2() {
    const [profileName, setProfileName] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const targetRefs = useRef<Map<string, HTMLImageElement> | null>(null);
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
    const referenceTarget = useCallback(
        (name: string, node: HTMLImageElement | null) => {
            targetRefs.current ??= new Map();
            const map = targetRefs.current;

            if (node !== null) {
                map.set(name, node);
            } else {
                map.delete(name);
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

        if (targetRefs.current) {
            targetRefs.current.forEach((e) => observer.observe(e));
        }

        return () => observer.disconnect();
    }, [observer]);

    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <Card className="w-[30rem]">
                <div className="flex flex-col items-center gap-[30px]">
                    <DoubleSharp width="24" height="24" />
                    <p>기본 프로필을 선택해주세요.</p>
                </div>

                {/* 아래 삼각형 */}
                <div className="h-0 items-center justify-center border-[30px] border-b-0 border-solid border-y-transparent border-l-transparent border-r-transparent border-t-[white]"></div>

                <div className="z-10 w-[24rem] overflow-clip">
                    <div
                        ref={rootRef}
                        className="z-20 flex snap-x snap-mandatory flex-row gap-5 overflow-auto pb-10"
                    >
                        <div className="shrink-0 snap-center">
                            <div className="w-7 shrink-0"></div>
                        </div>
                        <div className="flex-shrink-0 snap-center snap-always"></div>
                        {defaultProfilesKey.map((name) => (
                            <div
                                key={name}
                                className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden"
                            >
                                <Image
                                    ref={(node) => referenceTarget(name, node)}
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
                        <div className="flex-shrink-0 snap-center snap-always"></div>
                        <div className="shrink-0 snap-center">
                            <div className="w-7 shrink-0"></div>
                        </div>
                    </div>
                </div>
                <p>selected profile: {profileName}</p>

                {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
                <IconArrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </Card>
        </main>
    );
}
