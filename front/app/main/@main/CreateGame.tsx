"use client";
import { useRouter } from "next/navigation";

export default function CreateGame() {
    const router = useRouter();

    // 실제로 fetch 하면 시간 걸리니까 일단 편의상 만들어둔 dummy async 함수
    const asyncRoute = async () => {
        await new Promise((res) => setTimeout(res, 0));
        router.push("/main/game/4242");
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

    //     router.push(`/main/game/${newGameId}`);
    // }

    return (
        <button
            type="button"
            onClick={asyncRoute}
            // href="/main/game/1234"
            className="relative flex place-items-center"
        >
            <div className="gradient-border before:pointer-elvents-none group relative flex w-[262px] flex-col items-start gap-2 rounded-[28px] border-transparent bg-windowGlass/30 p-px px-5 py-4 backdrop-blur-[20px] backdrop-brightness-100 transition-colors before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary focus:outline-2 focus:outline-gray-100 focus:ring focus:ring-violet-300 active:bg-violet-700 hover:dark:border-purple-700 hover:dark:bg-neutral-800/30">
                <h2 className={"text-sans  text-2xl font-medium "}>
                    Go to Game
                </h2>
            </div>
        </button>
    );
}
