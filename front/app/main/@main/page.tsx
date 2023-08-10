import Link from "next/link";
import CreateGame from "./CreateGame";

export default function Home() {
    return (
        <>
            <Link
                href="/main/dropdown"
                className="relative flex place-items-center"
            >
                <div className="gradient-border before:pointer-elvents-none group relative flex w-[262px] flex-col items-start gap-2 rounded-[28px] border-transparent bg-windowGlass/30 p-px px-5 py-4 backdrop-blur-[20px] backdrop-brightness-100 transition-colors before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary focus:outline-2 focus:outline-gray-100 focus:ring focus:ring-violet-300 active:bg-violet-700 hover:dark:border-purple-700 hover:dark:bg-neutral-800/30">
                    <h2 className={"text-sans text-2xl font-medium "}>
                        Dropdown menu
                    </h2>
                </div>
            </Link>
            <Link
                href="/main/social"
                className="relative flex place-items-center"
            >
                <div className="gradient-border before:pointer-elvents-none group relative flex w-[262px] flex-col items-start gap-2 rounded-[28px] border-transparent bg-windowGlass/30 p-px px-5 py-4 backdrop-blur-[20px] backdrop-brightness-100 transition-colors before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary focus:outline-2 focus:outline-gray-100 focus:ring focus:ring-violet-300 active:bg-violet-700 hover:dark:border-purple-700 hover:dark:bg-neutral-800/30">
                    <h2 className={"text-sans  text-2xl font-medium "}>
                        Social menu
                    </h2>
                </div>
            </Link>
            <CreateGame />
        </>
    );
}
