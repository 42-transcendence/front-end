import { ContextMenuBase } from "./ContextMenuBase";
import { ContextMenuItem } from "./ContextMenuItem";

export type ProfileItemConfig = {
    id: number;
    uuid: string;
    tag: string;
    name: string;
    statusMessage: string;
};

export function ContextMenuBase_Profile({
    profile,
    children,
}: React.PropsWithChildren<{ profile: ProfileItemConfig }>) {
    //TODO: if profile.id is undefined, throw error

    return (
        <ContextMenuBase className="w-full">
            <ContextMenuItem
                name={profile.name}
                description={profile.tag}
                className="text-xl"
                disabled
            />
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            {children}
        </ContextMenuBase>
    );
}
