import { ProfileSection } from "@/components/Profile/ProfileSection";

export default function ProfileLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex h-full w-full flex-col items-start overflow-auto bg-windowGlass/30 backdrop-blur-[50px] lg:flex-row">
            <ProfileSection />
            {children}
        </div>
    );
}
