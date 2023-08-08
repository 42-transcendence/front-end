"use client";

import Link from "next/link";

export default function DefaultPage() {
    return (
        <main>
            <p>default page</p>
            <Link href="/main">go to main</Link>
        </main>
    );
}
