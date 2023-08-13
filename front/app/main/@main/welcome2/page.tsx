"use client";

import { DoubleSharp, IconArrow3 } from "@/components/ImageLibrary";
import UIFrame from "@/components/UIFrame/UIFrame";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Welcome2() {
    const [profileName, setProfileName] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const targetRefs = useRef<Map<string, HTMLImageElement> | null>(null);

    const observerOptions = {
        root: rootRef.current,
        rootMargin: "0px",
        threshold: 1.0,
    };

    const handleIntersect = (
        entries: IntersectionObserverEntry[],
        _observer: IntersectionObserver,
    ) => {
        entries.forEach((entry) => {
            setProfileName(entry.target.alt); // TODO target이 HTMLImageElement 라는걸 어떻게? alt 대신 name이나 key로 변경?
        });
    };

    function getMap(): Map<string, HTMLImageElement> {
        if (targetRefs.current === null) {
            targetRefs.current = new Map();
        }
        return targetRefs.current;
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const defaultProfiles = [
        "jisookim",
        "iyun",
        "hdoo",
        "jkong",
        "chanhpar",
    ].map((name) => {
        return (
            <div
                key={name}
                className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden"
            >
                <Image
                    ref={(node) => {
                        const map = getMap();
                        if (map === null) return;
                        node ? map.set(name, node) : map.delete(name);
                    }}
                    className="box-content "
                    src={`/${name}.png`}
                    alt={name}
                    width="250"
                    height="250"
                />
            </div>
        );
    });

    useEffect(() => {
        if (rootRef.current === null) return;

        if (targetRefs.current)
            targetRefs.current.forEach((x) => observer.observe(x));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <UIFrame className="w-[30rem]">
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
                            <div className="w-4 shrink-0"></div>
                        </div>
                        <div className="flex-shrink-0 snap-center snap-always"></div>
                        {defaultProfiles}
                        <div className="shrink-0 snap-center">
                            <div className="w-4 shrink-0"></div>
                        </div>
                    </div>
                </div>
                <p>selected profile: {profileName}</p>

                {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
                <IconArrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </UIFrame>
        </>
    );
}
