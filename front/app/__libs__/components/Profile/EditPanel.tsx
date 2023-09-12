import { useState, type PropsWithChildren } from "react";
import { Panel } from "./Panel";
import { Avatar } from "../Avatar";
import { Separator } from "./GameHistoryPanel";
import { usePublicProfile } from "@hooks/useProfile";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { SelectAvatar } from "@/app/(main)/@home/welcome2/SelectAvatar";

export function EditPanel() {
    const accountUUID = useCurrentAccountUUID();
    const profile = usePublicProfile(accountUUID);
    const [editAvatar, setEditAvatar] = useState(false);

    if (profile === undefined) {
        return <div>loading...</div>;
    }

    return (
        <Panel className="flex flex-col items-start justify-start overflow-clip md:col-span-2 md:row-span-1">
            <span className="p-4 text-xl font-extrabold text-white">설정</span>
            <EditPanelItem>
                <EditPanelItemHeader>
                    <EditPanelItemHeaderTitle>
                        <Avatar
                            className={"relative w-12 "}
                            accountUUID={accountUUID}
                            privileged={false}
                        />
                    </EditPanelItemHeaderTitle>
                    <Separator />
                    <EditPanelItemHeaderContent>
                        <div className="flex flex-col">
                            <span>{profile.nickName}</span>
                            <span>{profile.nickTag}</span>
                        </div>
                    </EditPanelItemHeaderContent>
                </EditPanelItemHeader>

                <EditPanelItemHeader>
                    <EditPanelItemHeaderTitle>
                        <button
                            type="button"
                            onClick={() => setEditAvatar(!editAvatar)}
                        >
                            아바타 변경
                        </button>
                    </EditPanelItemHeaderTitle>
                    <EditPanelItemHeaderContent>
                        {editAvatar && <SelectAvatar />}
                    </EditPanelItemHeaderContent>
                </EditPanelItemHeader>
            </EditPanelItem>
        </Panel>
    );
}

function EditPanelItem({ children }: PropsWithChildren) {
    return <div className="flex flex-col">{children}</div>;
}

function EditPanelItemHeader({ children }: PropsWithChildren) {
    return <div className="flex h-fit w-full flex-row gap-4">{children}</div>;
}

function EditPanelItemHeaderContent({ children }: PropsWithChildren) {
    return (
        <div className="flex w-full items-center justify-start p-4">
            {children}
        </div>
    );
}

function EditPanelItemHeaderTitle({ children }: PropsWithChildren) {
    return (
        <div className="relative flex w-20 items-center justify-start p-4">
            {children}
        </div>
    );
}

function EditPanelItemDetail({ children }: PropsWithChildren) {
    return <div className="relative flex flex-col">{children}</div>;
}
