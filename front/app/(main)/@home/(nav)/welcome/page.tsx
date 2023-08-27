"use client";

import { DoubleSharp, Icon } from "@/components/ImageLibrary";
import { TextField } from "@/components/TextField";
import { Card } from "@/components/Card/Card";
import { useState } from "react";

export default function Welcome() {
    const [query, setQuery] = useState("");

    return (
        <Card>
            <div className="flex w-fit flex-col items-center gap-[30px]">
                <DoubleSharp width="24" height="24" />
                <p>사용할 닉네임을 입력해주세요.</p>
            </div>
            <div>
                <TextField
                    icon={
                        <button className="relative w-8 rounded bg-white/20 p-0.5 text-xs">
                            확인
                            {/* TODO : 이거 왜이래요..?? ㅋㅋ 자꾸 어디로 가려고함 ㅋㅋ */}
                        </button>
                    }
                    className="p-3"
                    value={query}
                    placeholder="닉네임을 입력해주세요!"
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>
            {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
            <Icon.Arrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
        </Card>
    );
}