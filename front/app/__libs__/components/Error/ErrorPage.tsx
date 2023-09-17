import { RoundButtonBase } from "@components/Button/RoundButton";
import Link from "next/link";

export function ErrorPage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-16">
            <span>Page not found</span>
            <Link className="relative" href="/">
                <RoundButtonBase>Back To Home</RoundButtonBase>
            </Link>
        </div>
    );
}
