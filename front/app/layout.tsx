import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { StrictMode } from "react";
import { Providers } from "./Providers";

const roboto = Roboto({ weight: "700", style: "normal", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Double Sharp",
    description: "Ping Pong ++++++++",
    applicationName: "Double Sharp𝄪",
    viewport: { width: "device-width", initialScale: 1 },
    formatDetection: { address: false, telephone: false, email: false },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className={`text-white ${roboto.className}`}>
                <Providers>
                    <StrictMode>{children}</StrictMode>
                </Providers>
            </body>
        </html>
    );
}
