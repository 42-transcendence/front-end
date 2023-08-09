import React from "react";
import { NavigationBar } from "../../../components/NavigationBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex h-screen flex-col self-stretch">
                <NavigationBar />
                {children}
            </div>
        </>
    );
}
