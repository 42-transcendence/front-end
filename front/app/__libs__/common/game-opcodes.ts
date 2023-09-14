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
    SYNCHRONIZE_REQUEST,
    RESYNCHRONIZE_RESULT,

    HANDSHAKE_MATCHMAKE = 0x100,
}

export const enum GameClientOpcode {
    GAME_ROOM,
    GAME_FAILED,
    ENTER_MEMBER,
    UPDATE_MEMBER,
    LEAVE_MEMBER,
    SYNCHRONIZE_RESULT,
    RESYNCHRONIZE_REQUEST,
    UPDATE_GAME,
    GAME_INTERMEDIATE_RESULT,
    GAME_FINAL_RESULT,
    ACHIEVEMENT,

    ENQUEUED = 0x100,
    INVITATION,
    MATCHMAKE_FAILED,
}
