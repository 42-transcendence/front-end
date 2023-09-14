"use client";

import { parseNickTag } from "@components/FriendModal/FriendModal";
import { Icon } from "@components/ImageLibrary";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const value = formData.get("nickAndTag");
        if (value !== null && typeof value === "string") {
            const result = parseNickTag(value);
            if (result === null) {
                target.reportValidity();
                target.reset();
                return;
            }
            router.push(`/profile/${result.nickName}/${result.nickTag}`);
        }
    };

    return (
        <div className="flex flex-col">
            <div>닉네임#태그를 입력해주세요</div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="text-black"
                    placeholder="nick#tag"
                    pattern="[a-zA-Z0-9가-힣]{2,8}#[1-9][0-9]{3}"
                    name="nickAndTag"
                />
                <button type="submit">
                    <Icon.Arrow1 className="" />
                </button>
            </form>
        </div>
    );
}
