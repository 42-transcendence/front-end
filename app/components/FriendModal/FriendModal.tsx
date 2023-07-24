import PropTypes from "prop-types";
import React from "react";
import { ProfileItem, ProfileItemConfig } from "../ProfileItem";
import "./style.css";
import { useState } from "react";

//TODO change contents with query data.
const profiles: ProfileItemConfig[] = [
    {
        id: 1,
        name: "hdoo",
        tag: "#00001",
        statusMessage: "Hello world!",
        showStatusMessage: true,
    },
    {
        id: 2,
        name: "chanhpar",
        tag: "#00002",
        statusMessage: "I'm chanhpar",
        showStatusMessage: true,
    },
    {
        id: 3,
        name: "iyun",
        tag: "#00003",
        statusMessage: "I'm IU",
        showStatusMessage: true,
    },
    {
        id: 4,
        name: "jkong",
        tag: "#00004",
        statusMessage: "I'm Jkong!",
        showStatusMessage: true,
    },
    {
        id: 5,
        name: "jisookim",
        tag: "#00005",
        statusMessage: "Hi I'm jisoo",
        showStatusMessage: true,
    },
];

export function FriendModal(): React.ReactElement {
    const [selectedId, setSelectedId] = useState<number>();

    return (
        <div className="friend-modal">
            {profiles.map((profile: ProfileItemConfig) => (
                <ProfileItem
                    key={profile.id}
                    config={profile}
                    selected={profile.id === selectedId}
                    onClick={() => {
                        setSelectedId(
                            profile.id !== selectedId ? profile.id : undefined
                        );
                    }}
                />
            ))}
        </div>
    );
}

FriendModal.propTypes = {
    isToggled: PropTypes.bool,
};