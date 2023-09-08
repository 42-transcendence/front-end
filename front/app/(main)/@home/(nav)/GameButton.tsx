"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { TextField } from "@components/TextField";

export function CreateGameButton() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-fit w-full flex-col gap-4 lg:flex-row">
            <RoundButtonBase onClick={() => setOpen(!open)}>
                Create Game
            </RoundButtonBase>
            {open && <CreateNewGameRoom />}
        </div>
    );
}

function CreateNewGameRoom() {
    return (
        <GlassWindow>
            <div className="flex h-full w-full flex-row items-center justify-start gap-4 p-4">
                <span>Title</span>
                <TextField className="w-full" />
            </div>
        </GlassWindow>
    );
}

export function QuickMatchButton() {
    const router = useRouter();

    // FIXME: 실제로 fetch 하면 시간 걸리니까 일단 편의상 만들어둔 dummy async 함수
    const asyncRoute = async () => {
        await new Promise((res) => setTimeout(res, 0));
        router.push("/game/4242");
    };

    // TODO: 실제로는 백에서 채팅방 받아와야. fetch할때 방 정보, 모드 등 parameter로 붙여서 요청
    // const handleClick = async () => {

    //     const res = await fetch(
    //         "https://www.random.org/integers/?num=1&min=1&max=1000&col=1&base=10&format=plain&rnd=new",
    //         { next: { revalidate: 0 } },
    //     );
    //     if (!res.ok) {
    //         throw new Error("fetch failure");
    //     }
    //     const newGameId = await res.json();

    //     router.push(`/game/${newGameId}`);
    // }

    return <RoundButtonBase onClick={asyncRoute}>Quick Match</RoundButtonBase>;
}
