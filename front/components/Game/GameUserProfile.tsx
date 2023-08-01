import { Avatar } from "../Avatar/Avatar";

export default function GameUserProfile() {
    return (
        <div className="flex w-[239px] items-center justify-center gap-[22px] py-7">
            <Avatar size={"w-12"} accountId={1} className={"fill-ultraDark"} />
            <div className="flex h-[67px] shrink-0 flex-col justify-center text-center text-2xl font-bold not-italic leading-[normal] text-white">
                hdoo
            </div>
        </div>
    );
}
