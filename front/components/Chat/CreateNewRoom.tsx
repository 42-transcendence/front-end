import { UUIDSetContainer, useUUIDSet } from "@/hooks/UUIDSetContext";
import { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/TextField";
import { ToggleButton } from "@/components/Button/ToggleButton";
import {
    IconInvite,
    IconKey,
    IconLock,
    IconMembers,
} from "@/components/ImageLibrary";
import { InviteList } from "@/components/Service/InviteList";
import { ButtonOnRight } from "../Button/ButtonOnRight";

const titlePattern = ".{4,32}";
const maxMemberLimit = 1500;

//TODO: 네이밍 다시 하기. 필요하면 나중에 쓰기
// export type CreateNewRoomParams = {
//     title: string;
//     password: string;
//     limit: number;
//     privateChecked: boolean;
//     secretChecked: boolean;
//     limitChecked: boolean;
//     inviteChecked: boolean;
// };

//TODO: 조금 더 잘 정리해서 hooks 폴더로 빼버리기
function useDetectSticky(): [
    boolean,
    React.LegacyRef<HTMLLabelElement>,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [isSticky, setIsSticky] = useState(false);
    const ref = useRef<HTMLLabelElement>(undefined!);

    // mount
    useEffect(() => {
        if (ref.current === undefined) {
            throw new Error();
        }
        const cachedRef = ref.current;
        const observer = new IntersectionObserver(
            ([e]) => {
                setIsSticky(e.intersectionRatio > 0 && e.intersectionRatio < 1);
            },
            { threshold: [1] },
        );

        observer.observe(cachedRef);

        // unmount
        return () => {
            observer.unobserve(cachedRef);
        };
    }, [ref]);

    return [isSticky, ref, setIsSticky];
}

export function CreateNewRoom() {
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(1);
    const [privateChecked, setPrivateChecked] = useState(false);
    const [secretChecked, setSecretChecked] = useState(false);
    const [limitChecked, setLimitChecked] = useState(false);
    const [inviteChecked, setInviteChecked] = useState(false);
    const [accountUUIDSet] = useUUIDSet();
    const formRef = useRef<HTMLFormElement>(null!);
    const formID = "newChatRoom";

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        void accountUUIDSet;

        const data = new FormData(formRef.current);
        const value = Object.fromEntries(data.entries());

        console.log(value);
    };

    return (
        <form
            id={formID}
            ref={formRef}
            autoComplete="off"
            onSubmit={handleSubmit}
            className="group hidden h-full w-full overflow-auto peer-checked:flex"
        >
            <div className="flex h-full w-full flex-col justify-between gap-4">
                <div className="flex flex-col gap-2 self-stretch overflow-auto">
                    <div className="relative flex h-fit w-full flex-col gap-2 py-2">
                        <TextField
                            type="text"
                            className="relative min-h-[3rem] bg-black/30 px-4 py-1 text-xl"
                            placeholder="Title..."
                            pattern={titlePattern}
                            name="chatRoomTitle"
                            form={formID}
                            required
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />

                        <div className="flex flex-col">
                            <ToggleButton
                                id="private"
                                formID={formID}
                                name="isPrivate"
                                checked={privateChecked}
                                setChecked={setPrivateChecked}
                                bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                icon={
                                    <IconLock
                                        width={56}
                                        height={56}
                                        className="rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                    />
                                }
                            >
                                <div>
                                    <p className="relative text-sm group-data-[checked=true]:hidden">
                                        공개
                                    </p>
                                    <p className="relative hidden text-sm group-data-[checked=true]:block">
                                        비공개
                                    </p>
                                </div>
                            </ToggleButton>

                            <ToggleButton
                                id="secret"
                                formID={formID}
                                name="isSecret"
                                checked={secretChecked}
                                setChecked={setSecretChecked}
                                bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                icon={
                                    <IconKey
                                        width={56}
                                        height={56}
                                        className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                    />
                                }
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="justify-center text-sm transition-all">
                                        비밀번호
                                    </div>
                                    <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-data-[checked=true]:flex">
                                        <TextField
                                            type="new-password"
                                            form={formID}
                                            name="password"
                                            placeholder="비밀번호 입력"
                                            className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </ToggleButton>

                            <ToggleButton
                                id="limit"
                                formID={formID}
                                name="isLimit"
                                checked={limitChecked}
                                setChecked={setLimitChecked}
                                bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                icon={
                                    <IconMembers
                                        width={56}
                                        height={56}
                                        className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                    />
                                }
                            >
                                <div className="flex flex-col gap-1">
                                    <h2 className="items-end justify-center text-sm transition-all">
                                        인원제한
                                    </h2>
                                    <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-data-[checked=true]:flex">
                                        <TextField
                                            type="number"
                                            form={formID}
                                            name="limit"
                                            disabled={!limitChecked}
                                            min={1}
                                            max={maxMemberLimit}
                                            placeholder="최대인원 입력"
                                            className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                                            value={limit}
                                            onChange={(event) =>
                                                setLimit(
                                                    Number(event.target.value),
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </ToggleButton>

                            <InviteFriendToggle
                                formID={formID}
                                checked={inviteChecked}
                                setChecked={setInviteChecked}
                            />
                        </div>
                    </div>
                </div>

                <ButtonOnRight
                    buttonText="만들기"
                    className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg group-valid:bg-green-700/80"
                />
            </div>
        </form>
    );
}

function InviteFriendToggle({
    checked,
    formID,
    setChecked,
}: {
    checked: boolean;
    formID: string;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [isSticky, ref] = useDetectSticky();

    return (
        <div className="flex flex-col gap-2">
            <label
                ref={ref}
                htmlFor="sectionHeader"
                data-checked={checked}
                data-sticky={isSticky}
                className="group sticky -top-1 z-10 flex h-fit w-full flex-row items-center gap-3 rounded p-3 transition-colors hover:bg-gray-500/30 hover:text-white data-[sticky=true]:bg-secondary data-[sticky=true]:duration-0"
            >
                <IconInvite
                    width={56}
                    height={56}
                    className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                />
                <input
                    onChange={(e) => setChecked(e.target.checked)}
                    checked={checked}
                    form={formID}
                    type="checkbox"
                    id="sectionHeader"
                    className="hidden"
                />
                <p className="px-1 text-sm group-data-[checked=true]:text-white">
                    초대 상대 선택
                </p>
            </label>
            {checked && <InviteList />}
        </div>
    );
}
