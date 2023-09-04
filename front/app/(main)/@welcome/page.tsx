"use client";

import { DoubleSharp, Icon } from "@/components/ImageLibrary";
import { TextField } from "@/components/TextField";
import { Card } from "@/components/Card/Card";
import { useState } from "react";
import { useRegisterNickName } from "@/hooks/useRegisterNickName";

export default function Welcome() {
    const [value, setValue] = useState("");
    const {
        register,
        error: _error, //FIXME: 오류
        conflict: _conflict, //FIXME: 더 이상 사용할 수 없는 닉네임
    } = useRegisterNickName();

    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <Card>
                <div className="flex w-fit flex-col items-center gap-8">
                    <DoubleSharp width="24" height="24" />
                    <p>사용할 닉네임을 입력해주세요.</p>
                </div>
                <div className="flex flex-row gap-2">
                    <TextField
                        className="peer p-3"
                        value={value}
                        pattern="[a-zA-Z0-9가-힣]{2,8}"
                        placeholder="닉네임을 입력해주세요!"
                        required
                        onChange={(event) => setValue(event.target.value)}
                    />
                    <button
                        className="relative w-8 rounded bg-white/20 p-0.5 text-xs peer-valid:bg-secondary/70"
                        onClick={() => void register(value)}
                    >
                        확인
                    </button>
                </div>
                {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
                <Icon.Arrow3 className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </Card>
        </main>
    );
}
