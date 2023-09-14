"use client";
import Link from "next/link";
import { DoubleSharp } from "@components/ImageLibrary";
import { useAtomValue } from "jotai";
import { IsMatchMakingAtom } from "@atoms/GameAtom";

export function HomeButton() {
    const isMatchMaking = useAtomValue(IsMatchMakingAtom);
    return (
        <Link tabIndex={-1} className="relative" href="/">
            <DoubleSharp
                tabIndex={0}
                className={`$ w-12 rounded-lg p-2 text-white outline-none transition-all hover:drop-shadow-[0_0_0.3rem_#ffffff90] focus-visible:outline-primary/70 ${
                    isMatchMaking && "animate-spin-slow ease-in-out"
                }`}
                width={48}
                height={48}
            />
        </Link>
    );
}
