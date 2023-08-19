"use client";

import { useRouter } from "next/navigation";

// TODO: 나중에 잘 정리해서 컴포넌트로 만들기 가능할듯?
function GameButtonBase({
    children,
    ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
    return (
        <button
            type="button"
            className="relative flex place-items-center"
            {...props}
        >
            <div className="gradient-border group relative flex w-[262px] flex-col items-start gap-2 rounded-[28px] border-transparent bg-windowGlass/30 p-px px-5 py-4 backdrop-blur-[50px] transition-colors before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:backdrop-brightness-100 before:content-[''] hover:bg-primary focus:outline-2 focus:outline-gray-100 focus:ring focus:ring-violet-300 active:bg-violet-700 hover:dark:border-purple-700 hover:dark:bg-neutral-800/30">
                <h2 className="text-sans text-2xl font-medium">{children}</h2>
            </div>
        </button>
    );
}

export function CreateGameButton() {
    return <GameButtonBase>Create Game</GameButtonBase>;
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

    return <GameButtonBase onClick={asyncRoute}>Quick Match</GameButtonBase>;
}
