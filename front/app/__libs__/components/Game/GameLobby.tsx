import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import { GameMemberAtom, GameReadyAtom } from "@atoms/GameAtom";
import { useAtom, useAtomValue } from "jotai";

export function GameLobby() {
    const currentAccountUUID = useCurrentAccountUUID();
    const members = useAtomValue(GameMemberAtom);
    const [ready, setReady] = useAtom(GameReadyAtom);

    const toggleReady = () => setReady(!ready);

    return (
        <div className="h-1/2 w-1/2">
            {members.map((member) => (
                <div
                    key={member.accountId}
                    className={`${
                        member.accountId === currentAccountUUID ? "" : ""
                    }`}
                >
                    <Avatar
                        accountUUID={member.accountId}
                        className="h-fit w-fit"
                        privileged={false}
                    />
                </div>
            ))}
            <button className="border-red-400" onClick={toggleReady}>
                {ready ? "unready" : "ready"}
            </button>
        </div>
    );
}
