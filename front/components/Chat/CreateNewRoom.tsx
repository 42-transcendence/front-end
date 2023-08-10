import { useEffect, useRef, useState } from "react";
import LockIcon from "/public/lock.svg";
import PasswordIcon from "/public/password.svg";
import { TextField } from "../TextField";

export function CreateNewRoom() {
    const [title, setTitle] = useState("");
    return (
        <div className="backblur absolute left-0 top-24 flex h-full w-full flex-col gap-2 rounded-[28px_28px_0px_0px] bg-black/30 p-4 ">
            <p className="pl-3 text-xs text-red-500/80">{title}</p>
            <TextField
                className="p-3"
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value);
                }}
            />
            <p className="invisible pl-3 text-xs text-red-500/80 peer-invalid:visible">
                Title too long
            </p>
            <div className="z-10 flex h-fit w-full flex-row justify-around rounded-xl bg-black/30 p-3">
                <LockIcon
                    width={96}
                    height={96}
                    className="rounded-xl bg-primary/80 p-4 text-gray-50/80"
                />
                <PasswordIcon
                    width={96}
                    height={96}
                    className="rounded-xl bg-primary/80 p-4 text-gray-50/80"
                />
            </div>
        </div>
    );
}
