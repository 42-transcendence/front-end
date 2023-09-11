"use client";

import { DoubleSharp, Icon } from "@components/ImageLibrary";
import { TextField } from "@components/TextField";
import { Card } from "@components/Card/Card";
import { useState } from "react";
import { useRegisterNickName } from "@hooks/useRegisterNickName";

export default function Welcome() {
    const [value, setValue] = useState("");
    const {
        register,
        error, //FIXME: 오류
        conflict, //FIXME: 더 이상 사용할 수 없는 닉네임
    } = useRegisterNickName();

    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <Card>
                <div className="flex w-fit flex-col items-center gap-8">
                    <DoubleSharp width="24" height="24" />
                    <p>사용할 닉네임을 입력해주세요.</p>
                </div>
                <form
                    onClick={(e) => e.preventDefault()}
                    className="group relative flex flex-row gap-2"
                >
                    <div className="flex min-w-[12rem] max-w-xs flex-col">
                        <TextField
                            className="peer p-3"
                            value={value}
                            onKeyDown={(e) =>
                                e.key === "Enter" && void register(value)
                            }
                            pattern="[a-zA-Z0-9가-힣]{2,8}"
                            placeholder="닉네임을 입력해주세요!"
                            required
                            onChange={(event) => setValue(event.target.value)}
                        />
                        {error && (
                            <span className="p-2 text-sm text-red-500/90">
                                오류가 발생했습니다. 다시 시도해주세요.
                            </span>
                        )}
                        {conflict && (
                            <span className="p-2 text-sm text-red-500/90">
                                이미 9000명이 쓰는 흔해빠진 닉네임인데, 다른걸로
                                하시는게 어떤지..? 감히? 고견? 드립? 니다?
                            </span>
                        )}
                    </div>
                    <button
                        className="z-10 h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-500/80 p-2 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white group-valid:bg-green-500/50 group-valid:text-white"
                        onClick={() => void register(value)}
                    >
                        <Icon.Arrow3 className="" />
                    </button>
                </form>
                {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
            </Card>
        </main>
    );
}
