import { GameUserFrame } from "@/components/Game/GameUserFrame";
import {
    PlayAgainCard,
    NewAchievementCard,
    TrophyCard,
} from "@/components/Game/AfterGameCards";

export default function Main() {
    return (
        <div>
            <GameUserFrame />
            <div className=" m-20"></div>
            <TrophyCard />
            <div className=" m-20"></div>
            <PlayAgainCard />
            <div className=" m-20"></div>
            <NewAchievementCard />
        </div>
    );
}
