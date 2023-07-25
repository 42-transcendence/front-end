import Image from "next/image";
import { Status } from "@/components/Status";
import { Icon } from "@/components/Icon/Icon";
import { Avatar } from "@/components/Avatar";
import { FriendModal } from "@/components/FriendModal";

export default function Home() {
    return (
        <main className="flex min flex-col items-center justify-between p-24">

        <FriendModal />
            <div className="relative flex place-items-center">
                <div
                    className="gradient-border before:pointer-elvents-none relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] border-transparent hover:bg-primary hover:dark:border-purple-700 hover:dark:bg-neutral-800/30 active:bg-violet-700 focus:outline-gray-100 focus:ring focus:ring-violet-300 focus:outline-2 px-5 py-4 transition-colors gap-2 group"
                >
                    <h2 className={"mb-3 text-2xl font-semibold"}>
                        Game Start{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className={"m-0 max-w-[30ch] text-sm opacity-50 disable-select"}>
                        Find in-depth information about Next.js features and
                        API.
                    </p>
                </div>
            </div>
        </main>
    );
}


// border-transparent gradient-border before:pointer-elvents-none relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary hover:dark:border-purple-700 hover:dark:bg-neutral-800/30 active:bg-violet-700 focus:outline-gray-100 focus:ring focus:ring-violet-300 group border px-5 py-4 transition-colors gap-2
