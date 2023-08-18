import ChatLayout from "@/components/Chat/ChatLayout";

export default function ChatPage() {
    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <div className="absolute inset-0 flex h-full w-full flex-col font-extrabold">
                <ChatLayout />
            </div>
        </main>
    );
}
