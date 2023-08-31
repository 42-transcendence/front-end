import { ContextMenuBase } from "./ContextMenuBase";
import { ContextMenuItem } from "./ContextMenuItem";

export type ProfileItemConfig = {
    id: number;
    uuid: string;
    tag: string;
    name: string;
    statusMessage: string;
};

export function ContextMenuBase_Profile({ children }: React.PropsWithChildren) {
    //TODO: use SWR
    const name = "FALLBACK";
    const tag = "4242";

    return (
        <ContextMenuBase className="w-full">
            <ContextMenuItem
                name={name}
                description={tag}
                className="text-xl"
                disabled
            />
            <ContextMenuItem name="태그 복사하기" className="text-base" />
            {children}
        </ContextMenuBase>
    );
}
