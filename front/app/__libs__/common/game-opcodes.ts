// export const enum GameServerOpcode {
//   HANDSHAKE,
//   CREATE,
//   START,
//   JOIN,
//   FRAME
// }
//
// export const enum GameClientOpcode {
//   INITIALIZE,
//   ACCEPT,
//   REJECT,
//   START,
//   RESYNC,
//   SYNC,
//   WIN,
//   LOSE,
//   DRAW
// }
export const enum GameServerOpcode {
    HANDSHAKE_GAME,
    SELECT_CHAR,
    SELECT_SPEC,
    CHANGE_TEAM,
    READY_STATE,

    FRAME = 0x80,

    HANDSHAKE_MATCHMAKE = 0x100,
}

export const enum GameClientOpcode {
    GAME_ROOM,
    GAME_FAILED,
    ENTER_MEMBER,
    UPDATE_MEMBER,
    LEAVE_MEMBER,
    UPDATE_GAME,
    GAME_RESULT,
    ACHIEVEMENT,

    RESYNC_ALL = 0x80,
    RESYNC_PART,
    RESYNC_PARTOF,

    ENQUEUED = 0x100,
    INVITATION,
    MATCHMAKE_FAILED,
}
