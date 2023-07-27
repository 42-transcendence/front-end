import Head from "next/head";
import Image from "next/image";
import { ChatLayout } from "@/components/Chatting/ChatLayout";
import { NavigationBar } from "@/components/NavigationBar/NavigationBar";

export default function Main() {
    return (
        <div>
            <Head>
                <title>Main Screen</title>
            </Head>

            <div className="">
                <div className="flex h-screen flex-col text-4xl font-extrabold">
                    <ChatLayout />
                </div>
            </div>
        </div>
    );
}
