"use client";
import { Game } from "@components/ImageLibrary";
import { CreateGameButton, QuickMatchButton } from "./GameButton";
import { useStateArray } from "@hooks/useStateArray";
import { useState } from "react";
import { AfterGamePage } from "./AfterGamePage";

function HelloWorldPaper() {
    return (
        <div className="min-w-max">
            <div className="flex flex-row gap-[25px] pt-[10px]">
                <Game.Ghost3 width="80" height="80" color="#00FFD1" />
                <div className="flex flex-col pb-[59px] text-center text-[32px] font-bold italic leading-[45px] text-[#00FFD1]">
                    <div>HELLO, IT&lsquo;S</div>
                    <div>DOUBLE SHARP!</div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="pb-[46px] text-center text-[24px] font-bold not-italic leading-[45px] text-white">
                    <div>안녕하세요! 당신을 위한 핑퐁 게임,</div>
                    <div>[더블샵]에 오신 것을 환영합니다!</div>
                </div>
                <div className="text-center text-base font-bold not-italic leading-[28px] text-white">
                    <p>빠른 대전 - Quick Match</p>
                    <p>게임 만들기 - Create Game</p>
                </div>
                <div className="pt-[20px] text-center text-base font-normal italic leading-5 text-white text-white/30">
                    @42-transcendence
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [test, setTest] = useState(false);

    return test ? (
        <div className="flex h-full w-full items-center justify-center bg-black/30">
            <div className="flex w-full flex-col items-center justify-center gap-2.5 self-stretch lg:flex-row">
                <div className="flex flex-col items-start">
                    <HelloWorldPaper />
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                    <QuickMatchButton />
                    <CreateGameButton />
                </div>
            </div>
        </div>
    ) : (
        <AfterGamePage />
    );
}
