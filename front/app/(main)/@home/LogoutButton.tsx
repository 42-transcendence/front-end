"use client";

import { SquareButton } from "@/components/Button/SquareButton";

export function LogoutButton() {
    return (
        <SquareButton
            onClick={() => {
                window.localStorage.removeItem("access_token");
                window.localStorage.removeItem("refresh_token");
                window.location.assign("/"); // TODO: fix logic
            }}
        >
            Log out
        </SquareButton>
    );
}
