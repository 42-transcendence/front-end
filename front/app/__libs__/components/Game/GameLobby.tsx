import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import { GameReadyAtom } from "@atoms/GameAtom";
import { useAtom } from "jotai";
import GameUserProfile from "./GameUserProfile";

export function GameLobby() {
    const currentAccountUUID = useCurrentAccountUUID();
    const participantIds: string[] = [];
    const [ready, setReady] = useAtom(GameReadyAtom);

    const toggleReady = () => setReady(!ready);

    return (
        <div className="h-full w-full bg-cover bg-center">
            {participantIds.map((id) => (
                <div
                    key={id}
                    className={`${id === currentAccountUUID ? "" : ""}`}
                >
                    <Avatar accountUUID={id} className="" privileged={false} />
                </div>
            ))}
            <button className="border-red-400" onClick={toggleReady}>
                {ready ? "unready" : "ready"}
            </button>
            <GameUserProfile accountUUID={currentAccountUUID} />
        </div>
    );
}
