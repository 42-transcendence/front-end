import Image from "next/image";
import { Status } from "@/components/Status";
import { Icon } from "@/components/Icon/Icon";
import { Avatar } from "@/components/Avatar";
import { FriendModal } from "@/components/FriendModal";

export default function Home() {
    return (
        <main className="min flex flex-col items-center justify-between p-24">
            <FriendModal />
        </main>
    );
}

// border-transparent gradient-border before:pointer-elvents-none relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-[''] hover:bg-primary hover:dark:border-purple-700 hover:dark:bg-neutral-800/30 active:bg-violet-700 focus:outline-gray-100 focus:ring focus:ring-violet-300 group border px-5 py-4 transition-colors gap-2
