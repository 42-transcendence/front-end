import { LeftSideBarInput, RightSideBarInput } from "./ChatHeader";

export default function ChatLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="gradient-border back-full relative flex h-full w-full items-center justify-center rounded-[28px] p-px before:rounded-[28px] before:p-px 2xl:w-fit 2xl:min-w-[80rem]">
            <div className="back-full relative flex h-full w-full flex-row overflow-hidden rounded-[28px] bg-windowGlass/30 before:backdrop-blur-[50px]">
                <LeftSideBarInput />
                <RightSideBarInput />
                {children}
            </div>
        </div>
    );
}
