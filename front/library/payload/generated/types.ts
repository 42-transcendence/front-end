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
  MANAGER: "MANAGER",
  ADMINISTRATOR: "ADMINISTRATOR",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const enum RoleNumber {
  USER,
  MANAGER,
  ADMINISTRATOR,
}

export function getRoleNumber(value: Role): RoleNumber {
  switch (value) {
    case Role.USER:
      return RoleNumber.USER;

    case Role.MANAGER:
      return RoleNumber.MANAGER;

    case Role.ADMINISTRATOR:
      return RoleNumber.ADMINISTRATOR;
  }
}

export function getRoleFromNumber(number: RoleNumber): Role {
  switch (number) {
    case RoleNumber.USER:
      return Role.USER;

    case RoleNumber.MANAGER:
      return Role.MANAGER;

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

export const BanCategory = {
  ACCESS: "ACCESS",
  COMMIT: "COMMIT",
} as const;

export type BanCategory = (typeof BanCategory)[keyof typeof BanCategory];

export const enum BanCategoryNumber {
  ACCESS,
  COMMIT,
}

export function getBanCategoryNumber(value: BanCategory): BanCategoryNumber {
  switch (value) {
    case BanCategory.ACCESS:
      return BanCategoryNumber.ACCESS;

    case BanCategory.COMMIT:
      return BanCategoryNumber.COMMIT;
  }
}

export function getBanCategoryFromNumber(
  number: BanCategoryNumber,
): BanCategory {
  switch (number) {
    case BanCategoryNumber.ACCESS:
      return BanCategory.ACCESS;

    case BanCategoryNumber.COMMIT:
      return BanCategory.COMMIT;
  }
}

export const MessageType = {
  REGULAR: "REGULAR",
  NOTICE: "NOTICE",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const enum MessageTypeNumber {
  REGULAR,
  NOTICE,
}

export function getMessageTypeNumber(value: MessageType): MessageTypeNumber {
  switch (value) {
    case MessageType.REGULAR:
      return MessageTypeNumber.REGULAR;

    case MessageType.NOTICE:
      return MessageTypeNumber.NOTICE;
  }
}

export function getMessageTypeFromNumber(
  number: MessageTypeNumber,
): MessageType {
  switch (number) {
    case MessageTypeNumber.REGULAR:
      return MessageType.REGULAR;

    case MessageTypeNumber.NOTICE:
      return MessageType.NOTICE;
  }
}

export type AccountEntity = {
  id: string;
  authIssuer: number;
  authSubject: string;
  otpSecretKey: number | null;
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
};

export type AccountModel = {
  id: string;
  authIssuer: number;
  authSubject: string;
  otpSecret: SecretModel | null;
  otpSecretKey: number | null;
  createdTimestamp: Date;
  changedTimestamp: Date;
  registrationState: RegistrationStateNumber;
  nickName: string | null;
  nickTag: number;
  avatar: AvatarModel | null;
  avatarKey: string | null;
  role: RoleNumber;
  record: RecordModel | null;
  activeStatus: ActiveStatusNumber;
  activeTimestamp: Date;
  statusMessage: string;
  sessions: SessionModel[];
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
  sentChatDirects: ChatDirectModel[];
  receivedChatDirects: ChatDirectModel[];
  gameQueue: GameQueueModel | null;
  gameMember: GameMemberModel | null;
  gameHistory: GameHistoryModel[];
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
  id: bigint;
  accountId: string;
  token: string;
  createdTimestamp: Date;
  predecessorId: bigint | null;
  isValid: boolean;
};

export type SessionModel = {
  id: bigint;
  account: AccountModel;
  accountId: string;
  token: string;
  createdTimestamp: Date;
  successor: SessionModel | null;
  predecessor: SessionModel | null;
  predecessorId: bigint | null;
  isValid: boolean;
};

export type SecretEntity = {
  id: number;
  data: Uint8Array;
  params: JsonValue;
  createdTimestamp: Date;
  updatedTimestamp: Date;
};

export type SecretModel = {
  id: number;
  data: Uint8Array;
  params: JsonValue;
  createdTimestamp: Date;
  updatedTimestamp: Date;
  accountReferences: AccountModel[];
};

export type AvatarEntity = {
  id: string;
  data: Uint8Array;
  createdTimestamp: Date;
  updatedTimestamp: Date;
};

export type AvatarModel = {
  id: string;
  data: Uint8Array;
  createdTimestamp: Date;
  updatedTimestamp: Date;
  accountReferences: AccountModel[];
};

export type RecordEntity = {
  accountId: string;
  skillRating: number;
  experiencePoint: bigint;
  winCount: number;
  loseCount: number;
  tieCount: number;
  gameStatistics: JsonValue;
};

export type RecordModel = {
  account: AccountModel;
  accountId: string;
  achievements: AchievementModel[];
  skillRating: number;
  experiencePoint: bigint;
  winCount: number;
  loseCount: number;
  tieCount: number;
  gameStatistics: JsonValue;
};

export type AchievementEntity = {
  accountId: string;
  achievementId: number;
  completedTimestamp: Date;
};

export type AchievementModel = {
  record: RecordModel;
  accountId: string;
  achievementId: number;
  completedTimestamp: Date;
};

export type FriendEntity = {
  accountId: string;
  friendAccountId: string;
  groupName: string;
  activeFlags: string;
};

export type FriendModel = {
  account: AccountModel;
  accountId: string;
  friendAccount: AccountModel;
  friendAccountId: string;
  groupName: string;
  activeFlags: string;
};

export type EnemyEntity = {
  accountId: string;
  enemyAccountId: string;
  memo: string;
};

export type EnemyModel = {
  account: AccountModel;
  accountId: string;
  enemyAccount: AccountModel;
  enemyAccountId: string;
  memo: string;
};

export type BanEntity = {
  id: string;
  accountId: string;
  managerAccountId: string;
  category: BanCategoryNumber;
  reason: string;
  memo: string;
  expireTimestamp: Date | null;
  bannedTimestamp: Date;
};

export type BanModel = {
  id: string;
  account: AccountModel;
  accountId: string;
  managerAccount: AccountModel;
  managerAccountId: string;
  category: BanCategoryNumber;
  reason: string;
  memo: string;
  expireTimestamp: Date | null;
  bannedTimestamp: Date;
};

export type ChatEntity = {
  id: string;
  title: string;
  isPrivate: boolean;
  isSecret: boolean;
  password: string;
  limit: number;
};

export type ChatModel = {
  id: string;
  title: string;
  isPrivate: boolean;
  isSecret: boolean;
  password: string;
  limit: number;
  members: ChatMemberModel[];
  messages: ChatMessageModel[];
  bans: ChatBanModel[];
};

export type ChatMemberEntity = {
  chatId: string;
  accountId: string;
  role: RoleNumber;
  lastMessageId: string | null;
};

export type ChatMemberModel = {
  chat: ChatModel;
  chatId: string;
  account: AccountModel;
  accountId: string;
  role: RoleNumber;
  lastMessage: ChatMessageModel | null;
  lastMessageId: string | null;
};

export type ChatMessageEntity = {
  id: string;
  chatId: string;
  accountId: string;
  content: string;
  messageType: MessageTypeNumber;
  timestamp: Date;
};

export type ChatMessageModel = {
  id: string;
  chat: ChatModel;
  chatId: string;
  account: AccountModel;
  accountId: string;
  content: string;
  messageType: MessageTypeNumber;
  timestamp: Date;
  reachedMembers: ChatMemberModel[];
};

export type ChatBanEntity = {
  id: string;
  chatId: string;
  accountId: string;
  managerAccountId: string;
  category: BanCategoryNumber;
  reason: string;
  memo: string;
  expireTimestamp: Date | null;
  bannedTimestamp: Date;
};

export type ChatBanModel = {
  id: string;
  chat: ChatModel;
  chatId: string;
  account: AccountModel;
  accountId: string;
  managerAccount: AccountModel;
  managerAccountId: string;
  category: BanCategoryNumber;
  reason: string;
  memo: string;
  expireTimestamp: Date | null;
  bannedTimestamp: Date;
};

export type ChatDirectEntity = {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  content: string;
  timestamp: Date;
};

export type ChatDirectModel = {
  id: string;
  sourceAccount: AccountModel;
  sourceAccountId: string;
  destinationAccount: AccountModel;
  destinationAccountId: string;
  content: string;
  timestamp: Date;
};

export type GameEntity = {
  id: string;
  code: string;
  title: string;
  modeFlags: string;
  password: string;
  battlefield: number;
  timestamp: Date;
  statistic: JsonValue;
};

export type GameModel = {
  id: string;
  code: string;
  title: string;
  modeFlags: string;
  password: string;
  battlefield: number;
  timestamp: Date;
  statistic: JsonValue;
  members: GameMemberModel[];
};

export type GameMemberEntity = {
  gameId: string;
  accountId: string;
  modeFlags: string;
  statistic: JsonValue;
};

export type GameMemberModel = {
  game: GameModel;
  gameId: string;
  account: AccountModel;
  accountId: string;
  modeFlags: string;
  statistic: JsonValue;
};

export type GameQueueEntity = {
  accountId: string;
  skillRating: number;
  timestamp: Date;
};

export type GameQueueModel = {
  account: AccountModel;
  accountId: string;
  skillRating: number;
  timestamp: Date;
};

export type GameHistoryEntity = {
  id: string;
  modeFlags: string;
  battlefield: number;
  timestamp: Date;
  statistic: JsonValue;
  memberStatistics: JsonValue;
};

export type GameHistoryModel = {
  id: string;
  modeFlags: string;
  battlefield: number;
  timestamp: Date;
  statistic: JsonValue;
  members: AccountModel[];
  memberStatistics: JsonValue;
};
