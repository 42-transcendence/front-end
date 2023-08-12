"use client";

import { Button } from "@/components/Button/Button";

export function LogoutButton() {
    return (
        <Button onClick={() => {
            window.localStorage.removeItem("access_token");
            window.localStorage.removeItem("refresh_token");
            window.location.assign("/main"); // TODO: fix logic
        }} >
            Log out
        </Button>
    );
}
