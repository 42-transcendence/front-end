"use client";

import { SquareButton } from "@/components/Button/SquareButton";
import { logoutAction } from "./logoutAction";

export function LogoutButton() {
    return <SquareButton onClick={() => logoutAction()}>Log out</SquareButton>;
}
