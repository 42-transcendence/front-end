import { NavigationBar } from "@components/NavigationBar";

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
