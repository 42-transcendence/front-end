"use client";

import { useState, useEffect } from "react";

export default function MainLayout({
    login,
    main,
}: {
    login: React.ReactNode;
    main: React.ReactNode;
}) {
    const [loggedin, setLoggedin] = useState<boolean>(false);
    useEffect(() => {
        const receiveMessage = (event: MessageEvent) => {
            console.log(event);
            console.log(event.origin);
            if (event.origin !== "https://front.stri.dev") return;

            console.log(event.data);
            if (event.data === "OK") {
                setLoggedin(true);
            }
        };

        window.addEventListener("message", receiveMessage, false);

        return () => {
            window.removeEventListener("message", receiveMessage, false);
        };
    }, []);

    return <>{loggedin ? main : login}</>;
}
