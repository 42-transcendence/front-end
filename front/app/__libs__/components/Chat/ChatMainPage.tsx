export default function ChatMainPage({ children }: React.PropsWithChildren) {
    return (
        <div className="flex-grow-1 relative flex h-full w-full flex-col items-start bg-transparent transition-all 2xl:gap-4 2xl:p-4">
            {children}
        </div>
    );
}
