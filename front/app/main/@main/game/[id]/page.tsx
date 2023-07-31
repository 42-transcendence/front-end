"use client"
import { useParams } from "next/navigation";
import Link from "next/link";

const isValidGameId = (id: string | string[] | null) => {
    if (id === null)
        return false;
    if (Array.isArray(id))
        return false;
    return Number.isInteger(Number(id));
}

export default function Page() {
    const params = useParams();

    if (!isValidGameId(params.id)) {
        return (<div> <p>Invalid gameid</p><p>Go back</p></div>);
    }

    return (
        <div>
            <p>this is game room #{params.id}</p>
            <p><Link href="/main">go to main</Link></p>
            <p><Link href="/main/game">go to game</Link></p>
        </div>
    );
}

export const revalidate = 0;
