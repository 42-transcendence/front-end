import React from "react";
import { NavigationBar } from "@/components/NavigationBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-[100dvh] flex-shrink-0 flex-col">
            <NavigationBar />
            <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
                {children}
            </main>
        </div>
    );
}
