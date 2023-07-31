"use client"
import { useSearchParams } from "next/navigation";
import React from "react";

const isValidGameId = (_id: string) => true;

export default function GamePage() {
    const searchParams = useSearchParams();
    console.log(searchParams);

    const gameid = searchParams.get("gameid");

    if (gameid === null) {
        return (<div> <p>Invalid gameid</p><p>Go back</p></div>);
    }

    if (!isValidGameId(gameid)) {
        return (<div> <p>Invalid gameid</p><p>Go back</p></div>);
    }

    return (
        <div>
            <p>this is game page with query string</p>
            <p>gameid = {gameid} </p>
        </div>
    );
}
