import { Card } from "@components/Card/Card";
import { DoubleSharp } from "@components/ImageLibrary";
import { SelectAvatar } from "./SelectAvatar";

export default function Welcome2() {
    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <Card className="w-[30rem]">
                <div className="flex flex-col items-center gap-[30px]">
                    <DoubleSharp width="24" height="24" />
                    <p>기본 프로필을 선택해주세요.</p>
                </div>
                <div className="h-0 items-center justify-center border-[30px] border-b-0 border-solid border-y-transparent border-l-transparent border-r-transparent border-t-[white]"></div>
                <SelectAvatar />
            </Card>
        </main>
    );
}
