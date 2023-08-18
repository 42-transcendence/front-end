import { NavigationBar } from "@/components/NavigationBar";

// TODO: 좋은 이름 추천 받습니다. 해당 (nav) 폴더 이름도요

export default function LayoutWithNavigationBar({
    children,
}: React.PropsWithChildren) {
    return (
        <>
            <NavigationBar />
            <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
                {children}
            </main>
        </>
    );
}
