import { useState, type PropsWithChildren } from "react";
import { Panel } from "./Panel";
import { Avatar } from "../Avatar";
import { Separator } from "./GameHistoryPanel";
import { usePublicProfile } from "@hooks/useProfile";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { SelectAvatar } from "@components/SelectAvatar/SelectAvatar";
import { OTPRegistration } from "@components/OTPRegistration";
import { Dialog } from "@headlessui/react";

export function EditPanel() {
    const accountUUID = useCurrentAccountUUID();
    const profile = usePublicProfile(accountUUID);
    const [editAvatar, setEditAvatar] = useState(false);
    const [showOTP, setShowOTP] = useState(false);

    if (profile === undefined) {
        return <div>loading...</div>;
    }

    const handleClick = () => {
        setShowOTP(!showOTP);
    };

    return (
        <Panel className="flex flex-col items-start justify-start overflow-clip md:col-span-2 md:row-span-1">
            <span className="p-4 text-xl font-extrabold text-white">설정</span>
            <EditPanelItem>
                <EditPanelItemHeader>
                    <EditPanelItemHeaderTitle>
                        <Avatar
                            className={"relative w-12 bg-white/30"}
                            accountUUID={accountUUID}
                            privileged={false}
                        />

                        <div className="absolute bottom-0 left-0 flex w-full justify-center">
                            <button
                                type="button"
                                className="rounded bg-secondary p-1 py-0.5 text-xs"
                                onClick={() => setEditAvatar(!editAvatar)}
                            >
                                변경
                            </button>
                        </div>
                    </EditPanelItemHeaderTitle>
                    <Separator />
                    <EditPanelItemHeaderContent>
                        {editAvatar ? (
                            <Dialog open={editAvatar} onClose={setEditAvatar}>
                                <div
                                    className="fixed inset-0 bg-black/30"
                                    aria-hidden="true"
                                />
                                <Dialog.Panel className="gradient-border back-full absolute inset-4 inset-y-8 m-auto max-h-[36rem] max-w-lg overflow-hidden rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[50px] before:rounded-[28px] before:p-px lg:inset-32">
                                    <div className="flex w-full flex-col items-center justify-center gap-4 p-16">
                                        <SelectAvatar />
                                    </div>
                                </Dialog.Panel>
                            </Dialog>
                        ) : (
                            <div className="flex flex-col">
                                <span>{profile.nickName}</span>
                                <span className="text-gray-300/80">
                                    #{profile.nickTag}
                                </span>
                            </div>
                        )}
                    </EditPanelItemHeaderContent>
                </EditPanelItemHeader>

                <EditPanelItemHeader>
                    <EditPanelItemHeaderTitle>
                        <button type="button" onClick={handleClick}>
                            2차 인증 설정
                        </button>
                    </EditPanelItemHeaderTitle>
                    <EditPanelItemHeaderContent>
                        {showOTP && <OTPRegistration />}
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

// function EditPanelItemDetail({ children }: PropsWithChildren) {
//     return <div className="relative flex flex-col">{children}</div>;
// }
