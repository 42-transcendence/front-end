"use client";

import { DoubleSharp, Icon } from "@/components/ImageLibrary";
import { TextField } from "@/components/TextField";
import { Card } from "@/components/Card/Card";
import { useState } from "react";
import { fetcher } from "@/hooks/fetcher";

export default function Welcome() {
    const [query, setQuery] = useState("");

    return (
        <main className="flex overflow-auto relative flex-col gap-1 justify-center justify-self-stretch items-center h-full">
            <Card>
                <div className="flex flex-col gap-8 items-center w-fit">
                    <DoubleSharp width="24" height="24" />
                    <p>사용할 닉네임을 입력해주세요.</p>
                </div>
                <div className="flex flex-row gap-2">
                    <TextField
                        className="p-3 peer"
                        value={query}
                        pattern="[a-zA-Z0-9가-힣]{2,8}"
                        placeholder="닉네임을 입력해주세요!"
                        required
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                        className="relative p-0.5 w-8 text-xs rounded bg-white/20 peer-valid:bg-secondary/70"
                        onClick={() => {
                            //TODO: Add then chains
                            fetcher(`/profile/register?name=${query}`);
                        }}
                    >
                        확인
                    </button>
                </div>
                {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
                <Icon.Arrow3 className="flex z-10 justify-center items-center p-3 w-12 h-12 rounded-xl transition-colors duration-300 hover:text-white shrink-0 bg-gray-500/80 text-gray-200/50 hover:bg-primary" />
            </Card>
        </main>
    );
}
