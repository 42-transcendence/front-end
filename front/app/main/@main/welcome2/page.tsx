import { DoubleSharp, IconArrow3 } from "@/components/ImageLibrary";
import UIFrame from "@/components/UIFrame/UiFrame";
import Image from "next/image";

export default function Welcome2() {
    return (
        <>
            <UIFrame className="w-[30rem]">
                <div className="flex flex-col items-center gap-[30px]">
                    <DoubleSharp width="24" height="24" />
                    <p>기본 프로필을 선택해주세요.</p>
                </div>

                {/* 아래 삼각형 */}
                <div className="h-0 items-center justify-center border-[30px] border-b-0 border-solid border-y-transparent border-l-transparent border-r-transparent border-t-[white]"></div>

                <div className="z-10 w-[24rem] overflow-clip">
                    <div className="z-20 flex snap-x snap-mandatory flex-row gap-5 overflow-auto pb-10">
                        <div className="shrink-0 snap-center">
                            <div className="w-4 shrink-0"></div>
                        </div>
                        <div className="flex-shrink-0 snap-center snap-always"></div>
                        <div className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden">
                            <Image
                                className="box-content "
                                src={"/jisookim.png"}
                                alt="jisookim"
                                width="250"
                                height="250"
                            />
                        </div>
                        <div className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden">
                            <Image
                                className="box-content "
                                src={"/chanhpar.png"}
                                alt="chanhpar"
                                width="250"
                                height="250"
                            />
                        </div>
                        <div className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden">
                            <Image
                                className="box-content "
                                src={"/hdoo.png"}
                                alt="hdoo"
                                width="250"
                                height="250"
                            />
                        </div>
                        <div className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden">
                            <Image
                                className="box-content "
                                src={"/jkong.png"}
                                alt="jkong"
                                width="250"
                                height="250"
                            />
                        </div>
                        <div className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden">
                            <Image
                                className="box-content "
                                src={"/iyun.png"}
                                alt="iyun"
                                width="250"
                                height="250"
                            />
                        </div>
                        <div className="shrink-0 snap-center">
                            <div className="w-4 shrink-0"></div>
                        </div>
                    </div>
                </div>

                {/* TODO : 서버에서 닉네임이 중복되었는지, 가능한 닉네임인지 확인 */}
                <IconArrow3 className="z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-gray-500/80 p-3 text-gray-200/50 transition-colors duration-300 hover:bg-primary hover:text-white" />
            </UIFrame>
        </>
    );
}
