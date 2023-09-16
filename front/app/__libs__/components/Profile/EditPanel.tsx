import { useState, type PropsWithChildren, useEffect } from "react";
import { Panel } from "./Panel";
import { Avatar } from "../Avatar";
import { Separator } from "./GameHistoryPanel";
import { usePublicProfile } from "@hooks/useProfile";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { SelectAvatar } from "@components/SelectAvatar/SelectAvatar";
import { OTPRegistration } from "@components/OTPRegistration";
import { Dialog, Disclosure, Switch } from "@headlessui/react";
import { useGetOTP } from "@hooks/useOTP";
import { Icon } from "@components/ImageLibrary";

export function EditPanel() {
    const accountUUID = useCurrentAccountUUID();
    const profile = usePublicProfile(accountUUID);
    const [editAvatar, setEditAvatar] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const otpEnabled = useGetOTP();

    useEffect(() => {
        setShowOTP(false);
    }, [otpEnabled]);

    if (profile === undefined) {
        return <div>loading...</div>;
    }

    const handleClick = () => {
        setShowOTP(!showOTP);
    };

    return (
        <Panel className="flex flex-col items-start justify-start overflow-clip md:col-span-2 md:row-span-1">
            <span className="p-4 text-xl font-extrabold text-white">설정</span>
            <EditPanelBlocks>
                <EditPanelBlock>
                    <EditPanelBlockTitle>
                        <Avatar
                            className={"relative w-12 bg-white/30"}
                            accountUUID={accountUUID}
                            privileged={false}
                        />

                        <div className="absolute bottom-0 left-4 flex w-12 justify-center">
                            <button
                                type="button"
                                className="rounded bg-secondary p-1 py-0.5 text-xs"
                                onClick={() => setEditAvatar(!editAvatar)}
                            >
                                변경
                            </button>
                        </div>
                    </EditPanelBlockTitle>
                    <Separator />
                    <EditPanelBlockContent>
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
                    </EditPanelBlockContent>
                </EditPanelBlock>

                <EditPanelBlock>
                    <EditPanelBlockTitle>2차 인증</EditPanelBlockTitle>
                    <Separator />
                    <EditPanelBlockContent>
                        {otpEnabled === undefined ? (
                            <p className="loading">로딩중</p>
                        ) : (
                            <Switch
                                checked={otpEnabled}
                                onChange={handleClick}
                                className={`${
                                    otpEnabled
                                        ? "bg-secondary/80"
                                        : "bg-black/30"
                                }
          relative inline-flex w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-primary/30 focus-visible:ring-opacity-75`}
                            >
                                <span className="sr-only">Use setting</span>
                                <span
                                    aria-hidden="true"
                                    className={`${
                                        otpEnabled
                                            ? "translate-x-7"
                                            : "translate-x-0"
                                    }
            pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                />
                            </Switch>
                        )}
                        {showOTP && (
                            <Dialog open={showOTP} onClose={setShowOTP}>
                                <div
                                    className="fixed inset-0 bg-black/30"
                                    aria-hidden="true"
                                />
                                <Dialog.Panel className="gradient-border back-full absolute inset-4 inset-y-8 m-auto max-h-[36rem] max-w-lg overflow-hidden rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[50px] before:rounded-[28px] before:p-px lg:inset-32">
                                    <OTPRegistration />
                                </Dialog.Panel>
                            </Dialog>
                        )}
                    </EditPanelBlockContent>
                </EditPanelBlock>

                <EditPanelBlock>
                    <div className="relative mx-auto w-full rounded-2xl p-2">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-black/30 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-primary/30 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                        <span className="text-gray-50">
                                            차단 목록
                                        </span>
                                        <Icon.ChevronUpRegular
                                            className={` ${
                                                open
                                                    ? "rotate-180 transform"
                                                    : ""
                                            } h-5 w-5 text-primary`}
                                        />
                                    </Disclosure.Button>
                                    {/*TODO: Add ban list*/}
                                    <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500"></Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                </EditPanelBlock>
            </EditPanelBlocks>
        </Panel>
    );
}

function EditPanelBlocks({ children }: PropsWithChildren) {
    return <div className="flex flex-col">{children}</div>;
}

function EditPanelBlock({ children }: PropsWithChildren) {
    return <div className="flex h-fit w-full flex-row gap-4">{children}</div>;
}

function EditPanelBlockContent({ children }: PropsWithChildren) {
    return (
        <div className="relative flex w-full items-center justify-start p-4">
            {children}
        </div>
    );
}

function EditPanelBlockTitle({ children }: PropsWithChildren) {
    return (
        <div className="relative flex w-40 items-center justify-start p-4">
            {children}
        </div>
    );
}

// function EditPanelItemDetail({ children }: PropsWithChildren) {
//     return <div className="relative flex flex-col">{children}</div>;
