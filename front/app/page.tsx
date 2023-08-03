import Image from "next/image";
import Link from "next/link";
import { Status } from "@/components/Status";
import { Icon } from "@/components/Icon/Icon";
import { Avatar } from "@/components/Avatar";

export default function Home() {
    return (
        <main className="flex h-full w-full flex-col items-center justify-between p-24">
            <Link href="./main" className="relative flex place-items-center">
                <div className="gradient-border before:pointer-elvents-none group relative flex w-[262px] flex-col items-start gap-2 rounded-[28px] border-transparent bg-windowGlass/30 p-px px-5 py-4 backdrop-blur-[20px] backdrop-brightness-100 transition-colors before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary focus:outline-2 focus:outline-gray-100 focus:ring focus:ring-violet-300 active:bg-violet-700 hover:dark:border-purple-700 hover:dark:bg-neutral-800/30">
                    <h2 className={"text-2xl font-semibold"}>
                        Game Start{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p
                        className={
                            "disable-select m-0 max-w-[30ch] text-sm opacity-50"
                        }
                    >
                        Find in-depth information about Next.js features and
                        API.
                    </p>
                </div>
            </Link>
        </main>
    );
}

// border-transparent gradient-border before:pointer-elvents-none relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary hover:dark:border-purple-700 hover:dark:bg-neutral-800/30 active:bg-violet-700 focus:outline-gray-100 focus:ring focus:ring-violet-300 group border px-5 py-4 transition-colors gap-2
