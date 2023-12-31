"use client";

import { DoubleSharp, Icon } from "@components/ImageLibrary";
import { TextField } from "@components/TextField";
import { Card } from "@components/Card/Card";
import { useState } from "react";
import { useRegisterNickName } from "@hooks/useRegisterNickName";

export default function Welcome() {
    const [value, setValue] = useState("");
    const { register, error, conflict } = useRegisterNickName();

    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <Card>
                <div className="flex w-fit flex-col items-center gap-8">
                    <DoubleSharp width="24" height="24" />
                    <p className="text-center">사용할 닉네임을 입력해주세요.</p>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void register(value);
                    }}
                    className="group relative flex flex-row gap-2"
                >
                    <div className="flex min-w-[12rem] max-w-xs flex-col">
                        <TextField
                            className="peer p-3"
                            value={value}
                            pattern="[a-zA-Z0-9가-힣]{2,8}"
                            placeholder="닉네임을 입력해주세요!"
                            required
                            onChange={(event) => setValue(event.target.value)}
                        />
                        <p className="p-1 text-sm text-transparent peer-invalid:text-red-500/90">
                            한글, 영어 대소문자, 숫자 사용 가능. 2 ~ 8 글자
                        </p>
                        {error && (
                            <span className="p-2 text-sm text-red-500/90">
                                오류가 발생했습니다. 다시 시도해주세요.
                            </span>
                        )}
                        {conflict && (
                            <span className="p-2 text-sm text-red-500/90">
                                더 이상 사용할 수 없는 닉네임입니다. 다른
                                닉네임을 입력해주세요.
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => void register(value)}
                        className="z-10 h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-500/80 p-2 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white group-valid:bg-green-500/50 group-valid:text-white"
                        type="button"
                    >
                        <Icon.Arrow3 />
                    </button>
                </form>
            </Card>
        </main>
    );
}
