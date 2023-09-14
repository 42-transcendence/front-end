//TODO: 작성

import type { GameRoomParams } from "./game-payloads";
import { BattleField, GameMode } from "./game-payloads";

export const params: GameRoomParams = {
    battleField: BattleField.SQUARE,
    gameMode: GameMode.UNIFORM,
    limit: 2,
    fair: true,
    ladder: true,
  };