import type { ByteBuffer } from "@akasha-lib";
import { hasProperty } from "@akasha-lib";

export type GameInvitationPayload = {
    user_id: string;
    server_id: string;
    game_id: string;
    observer?: true | undefined;
};

export function isGameInvitationPayload(
    value: unknown,
): value is GameInvitationPayload {
    if (
        typeof value === "object" &&
        value !== null &&
        hasProperty("string", value, "user_id") &&
        hasProperty("string", value, "server_id") &&
        hasProperty("string", value, "game_id")
    ) {
        //TODO: type narrowing `observer`
        value satisfies GameInvitationPayload;
        return true;
    }
    return false;
}

export const enum GameMatchmakeType {
    QUEUE,
    CREATE,
    ENTER,
    RESUME,
}

export const enum MatchmakeFailedReason {
    UNKNOWN,
    DUPLICATE,
    NOT_FOUND,
}

export enum BattleField {
    SQUARE,
    ROUND,
    ABSOLUTE,

    MAX_VALUE,
}

export enum GameMode {
    UNIFORM,
    GRAVITY,

    MAX_VALUE,
}

export function isValidLimit(limit: number): boolean {
    if ((limit & 1) !== 0) {
        return false;
    }
    if (limit < 0) {
        return false;
    }
    if (limit >= 6) {
        return false;
    }

    return true;
}

export type GameRoomProps = {
    id: string;
    code: string | null;
};

export function readGameRoomProps(buf: ByteBuffer): GameRoomProps {
    const id = buf.readUUID();
    const code = buf.readNullable(buf.readString);
    return { id, code };
}

export function writeGameRoomProps(obj: GameRoomProps, buf: ByteBuffer) {
    buf.writeUUID(obj.id);
    buf.writeNullable(obj.code, buf.writeString);
}

export type GameRoomParams = {
    battleField: BattleField;
    gameMode: GameMode;
    limit: number;
    fair: boolean;
};

export function readGameRoomParams(buf: ByteBuffer): GameRoomParams {
    const battleField = buf.read4Unsigned();
    const gameMode = buf.read1();
    const limit = buf.read2Unsigned();
    const fair = buf.readBoolean();
    return { battleField, gameMode, limit, fair };
}

export function writeGameRoomParams(obj: GameRoomParams, buf: ByteBuffer) {
    buf.write4Unsigned(obj.battleField);
    buf.write1(obj.gameMode);
    buf.write2Unsigned(obj.limit);
    buf.writeBoolean(obj.fair);
}

export type GameMemberParams = {
    accountId: string;
    character: number;
    specification: number;
    team: number;
    ready: boolean;
};

export function readGameMemberParams(buf: ByteBuffer): GameMemberParams {
    const accountId = buf.readUUID();
    const character = buf.read1();
    const specification = buf.read1();
    const team = buf.read1();
    const ready = buf.readBoolean();
    return { accountId, character, specification, team, ready };
}

export function writeGameMemberParams(obj: GameMemberParams, buf: ByteBuffer) {
    buf.writeUUID(obj.accountId);
    buf.write1(obj.character);
    buf.write1(obj.specification);
    buf.write1(obj.team);
    buf.writeBoolean(obj.ready);
}

export const enum GameRoomEnterResult {
    SUCCESS,
    EXPIRED_INVITATION,
    ACCOUNT_MISMATCH,
    SERVER_MISMATCH,
    NOT_FOUND,
    EXCEED_LIMIT,
    ALREADY_STARTED,
    GAME_MISMATCH,
    DUPLICATE,
    UNKNOWN,
}

export type GameProgress = {
    currentSet: number;
    maxSet: number;
    score: number[];
    initialStartTime: number;
    totalTimespan: number;
    suspended: boolean;
    resumedTime: number;
    consumedTimespanSum: number;
    resumeScheduleTime: number | null;
};

export function readGameProgress(buf: ByteBuffer): GameProgress {
    const currentSet = buf.read1();
    const maxSet = buf.read1();
    const score = buf.readArray(buf.read1);
    const initialStartTime = buf.readDate().valueOf();
    const totalTimespan = buf.read4Unsigned();
    const suspended = buf.readBoolean();
    const resumedTime = buf.readDate().valueOf();
    const consumedTimespanSum = buf.read4Unsigned();
    const resumeScheduleTime =
        buf.readNullable(buf.readDate)?.valueOf() ?? null;
    return {
        currentSet,
        maxSet,
        score,
        initialStartTime,
        totalTimespan,
        suspended,
        resumedTime,
        consumedTimespanSum,
        resumeScheduleTime,
    };
}

export function writeGameProgress(obj: GameProgress, buf: ByteBuffer) {
    buf.write1(obj.currentSet);
    buf.write1(obj.maxSet);
    buf.writeArray(obj.score, buf.write1);
    buf.writeDate(new Date(obj.initialStartTime));
    buf.write4Unsigned(obj.totalTimespan);
    buf.writeBoolean(obj.suspended);
    buf.writeDate(new Date(obj.resumedTime));
    buf.write4Unsigned(obj.consumedTimespanSum);
    buf.writeNullable(
        obj.resumeScheduleTime !== null
            ? new Date(obj.resumeScheduleTime)
            : null,
        buf.writeDate,
    );
}

export const enum GameOutcome {
    NONE,
    WIN,
    LOSE,
    TIE,
}

export type GameEarnScore = {
    accountId: string;
    team: number;
    value: number;
    timestamp: Date;
};

export function readGameEarnScore(buf: ByteBuffer): GameEarnScore {
    const accountId = buf.readUUID();
    const team = buf.read1();
    const value = buf.read1();
    const timestamp = buf.readDate();
    return {
        accountId,
        team,
        value,
        timestamp,
    };
}

export function writeGameEarnScore(obj: GameEarnScore, buf: ByteBuffer) {
    buf.writeUUID(obj.accountId);
    buf.write1(obj.team);
    buf.write1(obj.value);
    buf.writeDate(obj.timestamp);
}

export type GameStatistics = {
    gameId: string;
    params: GameRoomParams;
    ladder: boolean;
    timestamp: Date;
    progresses: GameProgress[];
    earnScores: GameEarnScore[][];
};

export function readGameStatistics(buf: ByteBuffer): GameStatistics {
    const gameId = buf.readUUID();
    const params = readGameRoomParams(buf);
    const ladder = buf.readBoolean();
    const timestamp = buf.readDate();
    const progresses = buf.readArray(readGameProgress);
    const earnScores = buf.readArray((buf) => buf.readArray(readGameEarnScore));
    return {
        gameId,
        params,
        ladder,
        timestamp,
        progresses,
        earnScores,
    };
}

export function writeGameStatistics(obj: GameStatistics, buf: ByteBuffer) {
    buf.writeUUID(obj.gameId);
    writeGameRoomParams(obj.params, buf);
    buf.writeBoolean(obj.ladder);
    buf.writeDate(obj.timestamp);
    buf.writeArray(obj.progresses, writeGameProgress);
    buf.writeArray(obj.earnScores, (obj, buf) =>
        buf.writeArray(obj, writeGameEarnScore),
    );
}

export type GameMemberStatistics = {
    accountId: string;
    team: number;
    final: boolean;
    outcome: GameOutcome;
    initialSkillRating: number | undefined;
    initialRatingDeviation: number | undefined;
    finalSkillRating: number | undefined;
    finalRatingDeviation: number | undefined;
};

export function readGameMemberStatistics(
    buf: ByteBuffer,
): GameMemberStatistics {
    const accountId = buf.readUUID();
    const team = buf.read1();
    const final = buf.readBoolean();
    const outcome = buf.read1();
    const initialSkillRating = buf.readNullable(buf.read4Unsigned) ?? undefined;
    const initialRatingDeviation =
        buf.readNullable(buf.read4Unsigned) ?? undefined;
    const finalSkillRating = buf.readNullable(buf.read4Unsigned) ?? undefined;
    const finalRatingDeviation =
        buf.readNullable(buf.read4Unsigned) ?? undefined;
    return {
        accountId,
        team,
        final,
        outcome,
        initialSkillRating,
        initialRatingDeviation,
        finalSkillRating,
        finalRatingDeviation,
    };
}

export function writeGameMemberStatistics(
    obj: GameMemberStatistics,
    buf: ByteBuffer,
) {
    buf.writeUUID(obj.accountId);
    buf.write1(obj.team);
    buf.writeBoolean(obj.final);
    buf.write1(obj.outcome);
    buf.writeNullable(obj.initialSkillRating ?? null, buf.write4Unsigned);
    buf.writeNullable(obj.initialRatingDeviation ?? null, buf.write4Unsigned);
    buf.writeNullable(obj.finalSkillRating ?? null, buf.write4Unsigned);
    buf.writeNullable(obj.finalRatingDeviation ?? null, buf.write4Unsigned);
}
