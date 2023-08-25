import { ProfileSection } from "@/components/Profile/ProfileSection";

export default function ProfileLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex overflow-auto flex-col items-start w-full h-full lg:flex-row bg-windowGlass/30 backdrop-blur-[50px]">
            <ProfileSection />
            {children}
        </div>
    );
}
