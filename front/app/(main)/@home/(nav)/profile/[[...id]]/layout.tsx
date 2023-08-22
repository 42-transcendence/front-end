import { ProfileSection } from "@/components/Profile/ProfileSection";
export default function ProfileLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex h-full w-full flex-col items-start bg-black/30 backdrop-blur-[50px] 2xl:flex-row">
            <ProfileSection />
            {children}
        </div>
    );
}
