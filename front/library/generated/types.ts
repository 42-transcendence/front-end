/**
 *
 *  ░█████╗░██╗░░██╗░█████╗░░██████╗██╗░░██╗░█████╗░
 *  ██╔══██╗██║░██╔╝██╔══██╗██╔════╝██║░░██║██╔══██╗
 *  ███████║█████═╝░███████║╚█████╗░███████║███████║
 *  ██╔══██║██╔═██╗░██╔══██║░╚═══██╗██╔══██║██╔══██║
 *  ██║░░██║██║░╚██╗██║░░██║██████╔╝██║░░██║██║░░██║
 *  ╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝
 *
 * > This file is auto-generated. Don't modify it. <
 *
 *  ▄▀█ █▄▀ ▄▀█ █▀ █░█ ▄▀█ ▄▄ █▀█ █▀█ █ █▀ █▀▄▀█ ▄▀█
 *  █▀█ █░█ █▀█ ▄█ █▀█ █▀█ ░░ █▀▀ █▀▄ █ ▄█ █░▀░█ █▀█
 *
 *        █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ ▀█▀ █▀█ █▀█
 *        █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ ░█░ █▄█ █▀▄
 */

export type JsonObject = { [Key in string]?: JsonValue };
export interface JsonArray extends Array<JsonValue> {}
export type JsonValue =
    | string
    | number
    | boolean
    | JsonObject
    | JsonArray
    | null;

export const RegistrationState = {
    REGISTERING: "REGISTERING",
    REGISTERED: "REGISTERED",
    UNREGISTERING: "UNREGISTERING",
    UNREGISTERED: "UNREGISTERED",
} as const;

export type RegistrationState =
    (typeof RegistrationState)[keyof typeof RegistrationState];

export const enum RegistrationStateNumber {
    REGISTERING,
    REGISTERED,
    UNREGISTERING,
    UNREGISTERED,
}

export function getRegistrationStateNumber(
    value: RegistrationState,
): RegistrationStateNumber {
    switch (value) {
        case RegistrationState.REGISTERING:
            return RegistrationStateNumber.REGISTERING;

        case RegistrationState.REGISTERED:
            return RegistrationStateNumber.REGISTERED;

        case RegistrationState.UNREGISTERING:
            return RegistrationStateNumber.UNREGISTERING;

        case RegistrationState.UNREGISTERED:
            return RegistrationStateNumber.UNREGISTERED;
    }
}

export function getRegistrationStateFromNumber(
    number: RegistrationStateNumber,
): RegistrationState {
    switch (number) {
        case RegistrationStateNumber.REGISTERING:
            return RegistrationState.REGISTERING;

        case RegistrationStateNumber.REGISTERED:
            return RegistrationState.REGISTERED;

        case RegistrationStateNumber.UNREGISTERING:
            return RegistrationState.UNREGISTERING;

        case RegistrationStateNumber.UNREGISTERED:
            return RegistrationState.UNREGISTERED;
    }
}

export const Role = {
    USER: "USER",
    ADMINISTRATOR: "ADMINISTRATOR",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const enum RoleNumber {
    USER,
    ADMINISTRATOR,
}

export function getRoleNumber(value: Role): RoleNumber {
    switch (value) {
        case Role.USER:
            return RoleNumber.USER;

        case Role.ADMINISTRATOR:
            return RoleNumber.ADMINISTRATOR;
    }
}

export function getRoleFromNumber(number: RoleNumber): Role {
    switch (number) {
        case RoleNumber.USER:
            return Role.USER;

        case RoleNumber.ADMINISTRATOR:
            return Role.ADMINISTRATOR;
    }
}

export const ActiveStatus = {
    OFFLINE: "OFFLINE",
    ONLINE: "ONLINE",
    IDLE: "IDLE",
    DO_NOT_DISTURB: "DO_NOT_DISTURB",
    INVISIBLE: "INVISIBLE",
    MATCHING: "MATCHING",
    GAME: "GAME",
} as const;

export type ActiveStatus = (typeof ActiveStatus)[keyof typeof ActiveStatus];

export const enum ActiveStatusNumber {
    OFFLINE,
    ONLINE,
    IDLE,
    DO_NOT_DISTURB,
    INVISIBLE,
    MATCHING,
    GAME,
}

export function getActiveStatusNumber(value: ActiveStatus): ActiveStatusNumber {
    switch (value) {
        case ActiveStatus.OFFLINE:
            return ActiveStatusNumber.OFFLINE;

        case ActiveStatus.ONLINE:
            return ActiveStatusNumber.ONLINE;

        case ActiveStatus.IDLE:
            return ActiveStatusNumber.IDLE;

        case ActiveStatus.DO_NOT_DISTURB:
            return ActiveStatusNumber.DO_NOT_DISTURB;

        case ActiveStatus.INVISIBLE:
            return ActiveStatusNumber.INVISIBLE;

        case ActiveStatus.MATCHING:
            return ActiveStatusNumber.MATCHING;

        case ActiveStatus.GAME:
            return ActiveStatusNumber.GAME;
    }
}

export function getActiveStatusFromNumber(
    number: ActiveStatusNumber,
): ActiveStatus {
    switch (number) {
        case ActiveStatusNumber.OFFLINE:
            return ActiveStatus.OFFLINE;

        case ActiveStatusNumber.ONLINE:
            return ActiveStatus.ONLINE;

        case ActiveStatusNumber.IDLE:
            return ActiveStatus.IDLE;

        case ActiveStatusNumber.DO_NOT_DISTURB:
            return ActiveStatus.DO_NOT_DISTURB;

        case ActiveStatusNumber.INVISIBLE:
            return ActiveStatus.INVISIBLE;

        case ActiveStatusNumber.MATCHING:
            return ActiveStatus.MATCHING;

        case ActiveStatusNumber.GAME:
            return ActiveStatus.GAME;
    }
}

export const BanType = {
    ACCESS: "ACCESS",
    COMMIT: "COMMIT",
} as const;

export type BanType = (typeof BanType)[keyof typeof BanType];

export const enum BanTypeNumber {
    ACCESS,
    COMMIT,
}

export function getBanTypeNumber(value: BanType): BanTypeNumber {
    switch (value) {
        case BanType.ACCESS:
            return BanTypeNumber.ACCESS;

        case BanType.COMMIT:
            return BanTypeNumber.COMMIT;
    }
}

export function getBanTypeFromNumber(number: BanTypeNumber): BanType {
    switch (number) {
        case BanTypeNumber.ACCESS:
            return BanType.ACCESS;

        case BanTypeNumber.COMMIT:
            return BanType.COMMIT;
    }
}

export type AccountEntity = {
    id: number;
    uuid: string;
    authIssuer: number;
    authSubject: string;
    otpSecret: string | null;
    createdTimestamp: Date;
    changedTimestamp: Date;
    registrationState: RegistrationStateNumber;
    nickName: string | null;
    nickTag: number;
    avatarKey: string | null;
    role: RoleNumber;
    activeStatus: ActiveStatusNumber;
    activeTimestamp: Date;
    statusMessage: string;
    currentGameDeviceId: number | null;
};

export type AccountModel = {
    id: number;
    uuid: string;
    authIssuer: number;
    authSubject: string;
    otpSecret: string | null;
    createdTimestamp: Date;
    changedTimestamp: Date;
    registrationState: RegistrationStateNumber;
    nickName: string | null;
    nickTag: number;
    avatarKey: string | null;
    role: RoleNumber;
    record: RecordModel | null;
    activeStatus: ActiveStatusNumber;
    activeTimestamp: Date;
    statusMessage: string;
    sessions: SessionModel[];
    devices: DeviceModel[];
    friends: FriendModel[];
    friendReferences: FriendModel[];
    enemies: EnemyModel[];
    enemyReferences: EnemyModel[];
    bans: BanModel[];
    managedBanTargets: BanModel[];
    chatRooms: ChatMemberModel[];
    chatMessages: ChatMessageModel[];
    chatBans: ChatBanModel[];
    managedChatBanTargets: ChatBanModel[];
    gameQueue: GameQueueModel | null;
    gameMember: GameMemberModel | null;
    gameHistory: GameHistoryModel[];
    currentGameDevice: DeviceModel | null;
    currentGameDeviceId: number | null;
};

export type AuthorizationEntity = {
    id: string;
    endpointKey: string;
    redirectURI: string;
    createdTimestamp: Date;
};

export type AuthorizationModel = {
    id: string;
    endpointKey: string;
    redirectURI: string;
    createdTimestamp: Date;
};

export type SessionEntity = {
    id: number;
    accountId: number;
    token: string;
    createdTimestamp: Date;
    predecessorId: number | null;
    isValid: boolean;
};

export type SessionModel = {
    id: number;
    account: AccountModel;
    accountId: number;
    token: string;
    createdTimestamp: Date;
    successor: SessionModel | null;
    predecessor: SessionModel | null;
    predecessorId: number | null;
    isValid: boolean;
};

export type DeviceEntity = {
    id: number;
    fingerprint: string;
    createdTimestamp: Date;
    updatedTimestamp: Date;
    ipAddress: string;
    userAgent: string;
};

export type DeviceModel = {
    id: number;
    fingerprint: string;
    createdTimestamp: Date;
    updatedTimestamp: Date;
    ipAddress: string;
    userAgent: string;
    accounts: AccountModel[];
    gameAccount: AccountModel | null;
};

export type RecordEntity = {
    accountId: number;
    skillRating: number;
    winCount: number;
    loseCount: number;
    tieCount: number;
    gameStatistics: JsonValue;
};

export type RecordModel = {
    account: AccountModel;
    accountId: number;
    achievements: AchievementModel[];
    skillRating: number;
    winCount: number;
    loseCount: number;
    tieCount: number;
    gameStatistics: JsonValue;
};

export type AchievementEntity = {
    accountId: number;
    achievementId: number;
    completedTimestamp: Date;
};

export type AchievementModel = {
    record: RecordModel;
    accountId: number;
    achievementId: number;
    completedTimestamp: Date;
};

export type FriendEntity = {
    accountId: number;
    friendAccountId: number;
    groupName: string;
    activeFlags: number;
};

export type FriendModel = {
    account: AccountModel;
    accountId: number;
    friendAccount: AccountModel;
    friendAccountId: number;
    groupName: string;
    activeFlags: number;
};

export type EnemyEntity = {
    accountId: number;
    enemyAccountId: number;
    memo: string;
};

export type EnemyModel = {
    account: AccountModel;
    accountId: number;
    enemyAccount: AccountModel;
    enemyAccountId: number;
    memo: string;
};

export type BanEntity = {
    id: number;
    accountId: number;
    managerAccountId: number;
    type: BanTypeNumber;
    reason: string;
    memo: string;
    expireTimestamp: Date | null;
    bannedTimestamp: Date;
};

export type BanModel = {
    id: number;
    account: AccountModel;
    accountId: number;
    managerAccount: AccountModel;
    managerAccountId: number;
    type: BanTypeNumber;
    reason: string;
    memo: string;
    expireTimestamp: Date | null;
    bannedTimestamp: Date;
};

export type ChatEntity = {
    id: number;
    uuid: string;
    title: string;
    modeFlags: number;
    password: string;
    limit: number;
};

export type ChatModel = {
    id: number;
    uuid: string;
    title: string;
    modeFlags: number;
    password: string;
    limit: number;
    members: ChatMemberModel[];
    messages: ChatMessageModel[];
};

export type ChatMemberEntity = {
    chatId: number;
    accountId: number;
    modeFlags: number;
    lastMessageId: string | null;
};

export type ChatMemberModel = {
    chat: ChatModel;
    chatId: number;
    account: AccountModel;
    accountId: number;
    modeFlags: number;
    lastMessage: ChatMessageModel | null;
    lastMessageId: string | null;
};

export type ChatMessageEntity = {
    uuid: string;
    chatId: number;
    accountId: number;
    content: string;
    modeFlags: number;
    timestamp: Date;
};

export type ChatMessageModel = {
    uuid: string;
    chat: ChatModel;
    chatId: number;
    account: AccountModel;
    accountId: number;
    content: string;
    modeFlags: number;
    timestamp: Date;
    reachedMembers: ChatMemberModel[];
};

export type ChatBanEntity = {
    id: number;
    accountId: number;
    managerAccountId: number;
    type: BanTypeNumber;
    reason: string;
    memo: string;
    expireTimestamp: Date | null;
    bannedTimestamp: Date;
};

export type ChatBanModel = {
    id: number;
    account: AccountModel;
    accountId: number;
    managerAccount: AccountModel;
    managerAccountId: number;
    type: BanTypeNumber;
    reason: string;
    memo: string;
    expireTimestamp: Date | null;
    bannedTimestamp: Date;
};

export type GameEntity = {
    id: bigint;
    uuid: string;
    code: string;
    title: string;
    modeFlags: number;
    password: string;
    battlefield: number;
    timestamp: Date;
    statistic: JsonValue;
};

export type GameModel = {
    id: bigint;
    uuid: string;
    code: string;
    title: string;
    modeFlags: number;
    password: string;
    battlefield: number;
    timestamp: Date;
    statistic: JsonValue;
    members: GameMemberModel[];
};

export type GameMemberEntity = {
    gameId: bigint;
    accountId: number;
    modeFlags: number;
    statistic: JsonValue;
};

export type GameMemberModel = {
    game: GameModel;
    gameId: bigint;
    account: AccountModel;
    accountId: number;
    modeFlags: number;
    statistic: JsonValue;
};

export type GameQueueEntity = {
    accountId: number;
    skillRating: number;
    timestamp: Date;
};

export type GameQueueModel = {
    account: AccountModel;
    accountId: number;
    skillRating: number;
    timestamp: Date;
};

export type GameHistoryEntity = {
    id: bigint;
    uuid: string;
    modeFlags: number;
    battlefield: number;
    timestamp: Date;
    statistic: JsonValue;
    memberStatistics: JsonValue;
};

export type GameHistoryModel = {
    id: bigint;
    uuid: string;
    modeFlags: number;
    battlefield: number;
    timestamp: Date;
    statistic: JsonValue;
    members: AccountModel[];
    memberStatistics: JsonValue;
};
