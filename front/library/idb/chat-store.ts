import { IDBCP } from "./indexed-dbcp";

const DB_NAME_PREFIX = "akasha-";

function getMetadataDB(): Promise<IDBDatabase> {
    return IDBCP.getOrOpen(`${DB_NAME_PREFIX}chat`, {
        onUpgradeNeeded(db: IDBDatabase) {
            const rooms = db.createObjectStore("rooms", {
                keyPath: "uuid",
            });
            rooms.createIndex("account", "accounts", {
                multiEntry: true,
                unique: true,
            });
            // fetchedMessageUUID
        },
    });
}

type RoomSchema = {
    uuid: string;
    accounts: string[];
    title: string;
    modeFlags: number;
    fetchedMessageUUID: string | null;
};

function getDB(uuid: string): Promise<IDBDatabase> {
    return IDBCP.getOrOpen(`${DB_NAME_PREFIX}chat-${uuid}`, {
        onUpgradeNeeded(db: IDBDatabase) {
            db.createObjectStore("members", { keyPath: "uuid" });

            const messages = db.createObjectStore("messages", {
                keyPath: "uuid",
            });
            // memberUUID
            // content
            // modeFlags
            messages.createIndex("timestamp", "timestamp", { unique: false });
        },
    });
}

function removeDB(uuid: string): Promise<boolean> {
    return IDBCP.delete(`${DB_NAME_PREFIX}chat-${uuid}`);
}

type MemberSchema = {
    uuid: string;
    modeFlags: number;
};

type MessageSchema = {
    uuid: string;
    memberUUID: string;
    content: string;
    modeFlags: number;
    timestamp: Date;
};

export class ChatStore {
    /// Manipulate Room Set
    #Room: undefined;

    static async addRoom(
        accountUUID: string,
        uuid: string,
        title: string,
        modeFlags: number,
        fetchedMessageUUID: string | null = null,
    ): Promise<boolean> {
        const db = await getMetadataDB();
        return new Promise((resolve) => {
            const tx = db.transaction(["rooms"], "readwrite");
            tx.onerror = () => resolve(false);

            const rooms = tx.objectStore("rooms");
            const roomGet = rooms.get(uuid);
            roomGet.onsuccess = () => {
                const room = roomGet.result as RoomSchema | undefined;
                if (room === undefined) {
                    // Insert
                    const roomAdd = rooms.add({
                        ["uuid"]: uuid,
                        ["accounts"]: [accountUUID],
                        ["title"]: title,
                        ["modeFlags"]: modeFlags,
                        ["fetchedMessageUUID"]: fetchedMessageUUID,
                    } satisfies RoomSchema);

                    roomAdd.onsuccess = () =>
                        getDB(uuid)
                            .then(() => resolve(true))
                            .catch(() => resolve(false));
                } else {
                    // Update
                    room["accounts"].push(accountUUID);
                    room["title"] = title;
                    room["modeFlags"] = modeFlags;
                    if (fetchedMessageUUID !== null) {
                        room["fetchedMessageUUID"] = fetchedMessageUUID;
                    }
                    const roomPut = rooms.put(room);

                    roomPut.onsuccess = () => resolve(true);
                }
            };
        });
    }

    static async deleteRoom(
        accountUUID: string,
        uuid: string,
    ): Promise<boolean> {
        const db = await getMetadataDB();
        return new Promise((resolve) => {
            const tx = db.transaction(["rooms"], "readwrite");
            tx.onerror = () => resolve(false);

            const rooms = tx.objectStore("rooms");
            const roomGet = rooms.get(uuid);
            roomGet.onsuccess = () => {
                const room = roomGet.result as RoomSchema | undefined;
                if (room !== undefined) {
                    const accounts = room["accounts"];
                    const index = accounts.indexOf(accountUUID);
                    if (!(index < 0)) {
                        accounts.splice(index, 1);
                    }

                    if (accounts.length !== 0) {
                        // Update
                        const roomPut = rooms.put(room);

                        roomPut.onsuccess = () => resolve(true);
                    } else {
                        // Delete
                        const roomDelete = rooms.delete(uuid);

                        roomDelete.onsuccess = () =>
                            removeDB(uuid)
                                .then(() => resolve(true))
                                .catch(() => resolve(false));
                    }
                } else {
                    resolve(false);
                }
            };
        });
    }

    static async getRoomSet(accountUUID: string): Promise<Set<string> | null> {
        const db = await getMetadataDB();
        return new Promise((resolve) => {
            const tx = db.transaction(["rooms"], "readonly");
            tx.onerror = () => resolve(null);

            const rooms = tx.objectStore("rooms");
            const roomAllByAccountGet = rooms
                .index("account")
                .getAll(accountUUID);
            roomAllByAccountGet.onsuccess = () => {
                const roomArray = roomAllByAccountGet.result as RoomSchema[];
                resolve(new Set<string>(roomArray.map((e) => e["uuid"])));
            };
        });
    }

    static async hasRoom(accountUUID: string, uuid: string): Promise<boolean> {
        const db = await getMetadataDB();
        return new Promise((resolve) => {
            const tx = db.transaction(["rooms"], "readonly");
            tx.onerror = () => resolve(false);

            const rooms = tx.objectStore("rooms");
            const roomGet = rooms.get(uuid);
            roomGet.onsuccess = () => {
                const room = roomGet.result as RoomSchema | undefined;
                if (room !== undefined) {
                    resolve(room.accounts.includes(accountUUID));
                } else {
                    resolve(false);
                }
            };
        });
    }

    /// Manipulate Room-Options
    #Room_Options: undefined;

    private static async getFromRoom<T extends keyof RoomSchema>(
        uuid: string,
        key: T,
    ): Promise<RoomSchema[T]> {
        const db = await getMetadataDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(["rooms"], "readonly");
            tx.onerror = () => reject(new Error());

            const rooms = tx.objectStore("rooms");
            const roomGet = rooms.get(uuid);
            roomGet.onsuccess = () => {
                const room = roomGet.result as RoomSchema | undefined;
                if (room !== undefined) {
                    resolve(room[key]);
                } else {
                    reject(new Error());
                }
            };
        });
    }

    private static async putToRoom<T extends keyof RoomSchema>(
        uuid: string,
        key: T,
        value: RoomSchema[T],
    ): Promise<void> {
        const db = await getMetadataDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(["rooms"], "readwrite");
            tx.onerror = () => reject(new Error());

            const rooms = tx.objectStore("rooms");
            const roomGet = rooms.get(uuid);
            roomGet.onsuccess = () => {
                const room = roomGet.result as RoomSchema | undefined;
                if (room !== undefined) {
                    room[key] = value;
                    const roomPut = rooms.put(room);

                    roomPut.onsuccess = () => resolve();
                } else {
                    reject(new Error());
                }
            };
        });
    }

    static async getTitle(uuid: string): Promise<string> {
        return this.getFromRoom(uuid, "title");
    }

    static async setTitle(uuid: string, title: string): Promise<void> {
        return this.putToRoom(uuid, "title", title);
    }

    static async getModeFlags(uuid: string): Promise<number> {
        return this.getFromRoom(uuid, "modeFlags");
    }

    static async setModeFlags(uuid: string, modeFlags: number): Promise<void> {
        return this.putToRoom(uuid, "modeFlags", modeFlags);
    }

    static async getFetchedMessageUUID(uuid: string): Promise<string | null> {
        return this.getFromRoom(uuid, "fetchedMessageUUID");
    }

    static async setFetchedMessageUUID(
        uuid: string,
        fetchedMessageUUID: string,
    ): Promise<void> {
        return this.putToRoom(uuid, "fetchedMessageUUID", fetchedMessageUUID);
    }

    /// Manipulate Member Dictionary
    #MemberDictionary: undefined;

    static async putMember(
        uuid: string,
        member: MemberSchema,
    ): Promise<boolean> {
        const db = await getDB(uuid);
        return new Promise((resolve) => {
            const tx = db.transaction(["members"], "readwrite");
            tx.onerror = () => resolve(false);

            const members = tx.objectStore("members");
            const memberPut = members.put(member);

            memberPut.onsuccess = () => resolve(true);
        });
    }

    static async deleteMember(
        uuid: string,
        memberUUID: string,
    ): Promise<boolean> {
        const db = await getDB(uuid);
        return new Promise((resolve) => {
            const tx = db.transaction(["members"], "readwrite");
            tx.onerror = () => resolve(false);

            const members = tx.objectStore("members");
            const memberDelete = members.delete(memberUUID);

            memberDelete.onsuccess = () => resolve(true);
        });
    }

    static async getMemberDictionary(
        uuid: string,
    ): Promise<Map<string, MemberSchema> | null> {
        const db = await getDB(uuid);
        return new Promise((resolve) => {
            const tx = db.transaction(["rooms"], "readonly");
            tx.onerror = () => resolve(null);

            const members = tx.objectStore("members");
            const memberAllGet = members.getAll();
            memberAllGet.onsuccess = () => {
                const memberArray = memberAllGet.result as MemberSchema[];
                resolve(
                    memberArray.reduce(
                        (map, e) => map.set(e["uuid"], e),
                        new Map<string, MemberSchema>(),
                    ),
                );
            };
        });
    }

    static async getMember(
        uuid: string,
        memberUUID: string,
    ): Promise<MemberSchema | null> {
        const db = await getDB(uuid);
        return new Promise((resolve) => {
            const tx = db.transaction(["rooms"], "readonly");
            tx.onerror = () => resolve(null);

            const members = tx.objectStore("members");
            const memberGet = members.get(memberUUID);
            memberGet.onsuccess = () => {
                const member = memberGet.result as MemberSchema | undefined;
                resolve(member ?? null);
            };
        });
    }

    static async mergeMember(
        uuid: string,
        memberUUID: string,
        changes: Partial<MemberSchema>,
    ): Promise<MemberSchema | null> {
        const prevMember: MemberSchema | null = await this.getMember(
            uuid,
            memberUUID,
        );
        if (prevMember === null) {
            return null;
        }

        const member: MemberSchema = {
            ...prevMember,
            ...changes,
            uuid: memberUUID,
        };
        const put = await this.putMember(uuid, member);
        if (!put) {
            throw new Error();
        }

        return member;
    }

    /// Manipulate Message List
    #MessageList: undefined;

    static async addMessage(
        uuid: string,
        message: MessageSchema,
    ): Promise<boolean> {
        const db = await getDB(uuid);
        return new Promise((resolve) => {
            const tx = db.transaction(["messages"], "readwrite");
            tx.onerror = () => resolve(false);

            const messages = tx.objectStore("messages");
            const messageAdd = messages.add(message);

            messageAdd.onsuccess = () => resolve(true);
        });
    }

    static async getLastMessage(uuid: string): Promise<MessageSchema | null> {
        const db = await getDB(uuid);
        return new Promise((resolve, reject) => {
            const tx = db.transaction(["messages"], "readonly");
            tx.onerror = () => reject(new Error());

            const messages = tx.objectStore("messages");

            const messageAllReverseByTimestampCursor = messages
                .index("timestamp")
                .openCursor(null, "prev");
            messageAllReverseByTimestampCursor.onsuccess = () => {
                const cursor = messageAllReverseByTimestampCursor.result;
                if (cursor !== null) {
                    const message = cursor.value as MessageSchema;
                    resolve(message);
                } else {
                    resolve(null);
                }
            };
        });
    }

    static async countAfterMessage(
        uuid: string,
        messageUUID: string,
    ): Promise<number> {
        const db = await getDB(uuid);
        return new Promise((resolve, reject) => {
            const tx = db.transaction(["messages"], "readonly");
            tx.onerror = () => reject(new Error());

            const messages = tx.objectStore("messages");
            const messageGet = messages.get(messageUUID);

            messageGet.onsuccess = () => {
                const message = messageGet.result as MessageSchema | undefined;
                if (message === undefined) {
                    reject(new Error());
                    return;
                }

                const messageAfterByTimestampCount = messages
                    .index("timestamp")
                    .count(IDBKeyRange.lowerBound(message["timestamp"], true));
                messageAfterByTimestampCount.onsuccess = () =>
                    resolve(messageAfterByTimestampCount.result);
            };
        });
    }

    private static async getContinueMessages(
        reverse: boolean,
        uuid: string,
        messageUUID: string,
        limit?: number | undefined,
    ): Promise<MessageSchema[]> {
        const db = await getDB(uuid);
        return new Promise((resolve, reject) => {
            const tx = db.transaction(["messages"], "readonly");
            tx.onerror = () => reject(new Error());

            const messages = tx.objectStore("messages");
            const messageGet = messages.get(messageUUID);

            messageGet.onsuccess = () => {
                const message = messageGet.result as MessageSchema | undefined;
                if (message === undefined) {
                    reject(new Error());
                    return;
                }

                const targetTimestamp = message["timestamp"];
                const messageByTimestampIndex = messages.index("timestamp");
                const messageContinueByTimestampCursor = !reverse
                    ? messageByTimestampIndex.openCursor(
                          IDBKeyRange.lowerBound(targetTimestamp, false),
                          "next",
                      )
                    : messageByTimestampIndex.openCursor(
                          IDBKeyRange.upperBound(targetTimestamp, false),
                          "prev",
                      );
                const messageAllContinueByTimestamp =
                    new Array<MessageSchema>();
                messageContinueByTimestampCursor.onsuccess = () => {
                    const cursor = messageContinueByTimestampCursor.result;
                    if (cursor !== null) {
                        const message = cursor.value as MessageSchema;
                        if (message["uuid"] === messageUUID) {
                            // Indirect open range (exclude)
                            messageAllContinueByTimestamp.splice(0);
                        } else {
                            messageAllContinueByTimestamp.push(message);
                        }

                        if (
                            limit === undefined ||
                            (messageAllContinueByTimestamp.length < limit &&
                                // Prevent indirect exclusion checks from being invalidated by exceeding limit at the same timestamp.
                                targetTimestamp.valueOf() !==
                                    message["timestamp"].valueOf())
                            //TODO: 특수한 정지 표지 메시지로 fetch가 필요함을 나타내고, 표지가 관측될 때 서버로 요청을 보내면, lazy load를 만들 수 있을 것이다.
                        ) {
                            cursor.continue();
                            return;
                        }
                    }

                    if (limit !== undefined) {
                        messageAllContinueByTimestamp.splice(limit);
                    }
                    if (reverse) {
                        messageAllContinueByTimestamp.reverse();
                    }
                    resolve(messageAllContinueByTimestamp);
                };
            };
        });
    }

    static async getAfterMessages(
        uuid: string,
        messageUUID: string,
        limit?: number | undefined,
    ): Promise<MessageSchema[]> {
        return this.getContinueMessages(false, uuid, messageUUID, limit);
    }

    static async getBeforeMessages(
        uuid: string,
        messageUUID: string,
        limit?: number | undefined,
    ): Promise<MessageSchema[]> {
        return this.getContinueMessages(true, uuid, messageUUID, limit);
    }
}
