import { useState, type PropsWithChildren } from "react";
import { Panel } from "./Panel";
import { Avatar } from "../Avatar";
import { Separator } from "./GameHistoryPanel";
import { usePublicProfile } from "@hooks/useProfile";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { SelectAvatar } from "@/app/(main)/@home/welcome2/SelectAvatar";
import { QRCodeCanvas } from "@components/QRCodeCanvas";
import { OTPToggleBlocks } from "@/app/(main)/@otp/OTPInputBlocks";
import { useGetOTP } from "@hooks/useOTP";
import type { OTPSecret } from "@common/auth-payloads";

export function EditPanel() {
    const accountUUID = useCurrentAccountUUID();
    const profile = usePublicProfile(accountUUID);
    const [editAvatar, setEditAvatar] = useState(false);
    const [authInfo, setAuthInfo] = useState<OTPSecret | null>(null);
    const [showOTP, setShowOTP] = useState(false);
    const { data, conflict } = useGetOTP();

    if (profile === undefined) {
        return <div>loading...</div>;
    }

    const handleClick = () => {
        if (!showOTP) {
            if (!conflict) {
                setAuthInfo(data ?? null);
            }
        } else {
            setAuthInfo(null);
        }
        setShowOTP(!showOTP);
    };

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

                <EditPanelItemHeader>
                    <EditPanelItemHeaderTitle>
                        <button type="button" onClick={handleClick}>
                            2차 인증 설정
                        </button>
                    </EditPanelItemHeaderTitle>
                    <EditPanelItemHeaderContent>
                        {authInfo !== null && (
                            <QRCodeCanvas authInfo={authInfo} />
                        )}
                        {showOTP &&
                            (!conflict ? (
                                <>
                                    <div>OTP를 등록하려면 입력하세요</div>
                                    <OTPToggleBlocks length={6} enable={true} />
                                </>
                            ) : (
                                <>
                                    <div>OTP를 해제하려면 입력하세요 </div>
                                    <OTPToggleBlocks
                                        length={6}
                                        enable={false}
                                    />
                                </>
                            ))}
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
