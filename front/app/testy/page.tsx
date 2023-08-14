import AchivementCard from "@/components/Game/AchivementCard";
import GameNavBar from "@/components/Game/GameNavBar";
import NotificationCard from "@/components/Game/NotificationCard";
import GameUserFrame from "@/components/Game/GameUserFrame";
import GameAchievementCard, {
    ClikNotificationCard,
} from "@/components/Game/NotificationCard";

export default function Main() {
    return (
        <div>
            <GameUserFrame />
            <div className=" m-20"></div>
            <AchivementCard />
            <div className=" m-20"></div>
            <ClikNotificationCard />
            <div className=" m-20"></div>
            <GameAchievementCard />
        </div>
    );
}
