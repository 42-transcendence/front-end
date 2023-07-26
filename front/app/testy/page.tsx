import Head from "next/head";
import Image from "next/image";
import { ChattingSideBar } from "@/components/ChattingSideBar";
import { NavigationBar } from "@/components/NavigationBar";

export default function Main() {
    return (
        <div>
            <Head>
                <title>Sidebar</title>
                <ChattingSideBar />
            </Head>

            <ChattingSideBar/>
            <div className="py-32 text-center">
                <div className="text-4xl font-extrabold">
                    Sidebar + Navbar in Tailwind!
                </div>
            </div>
        </div>
    );
}
