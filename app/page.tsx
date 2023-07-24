import Image from "next/image";
import { Status } from "@/components/Status";
import { Icon } from "@/components/Icon/Icon";
import { Avatar } from "@/components/Avatar";
import { FriendModal } from "@/components/FriendModal";

export default function Home() {
    return (
        <main className=" flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-7xl items-stretch justify-end lg:flex">
                <FriendModal />
            </div>

            <div className="relative flex place-items-center">
                <a
                    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className="border-transparent hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 group rounded-lg border px-5 py-4 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={"mb-3 text-2xl font-semibold"}>
                        Game Start{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className={"m-0 max-w-[30ch] text-sm opacity-50"}>
                        Find in-depth information about Next.js features and
                        API.
                    </p>
                </a>
            </div>
        </main>
    );
}
