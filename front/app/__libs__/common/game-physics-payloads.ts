import type { ByteBuffer } from "@akasha-lib";

export type PhysicsAttribute = {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
};

export type Frame = {
    id: number;
    paddle1: PhysicsAttribute;
    paddle1Hit: boolean;
    paddle2: PhysicsAttribute;
    paddle2Hit: boolean;
    ball: PhysicsAttribute;
};

export type GravityObj = {
    pos: { x: number; y: number };
    radius: number;
    force: number;
};

export function writeGravityObj(payload: ByteBuffer, data: GravityObj) {
    payload.write4Float(data.pos.x);
    payload.write4Float(data.pos.y);
    payload.write4Unsigned(data.radius);
    payload.write4Float(data.force);
}

export function writeGravityObjs(payload: ByteBuffer, data: GravityObj[]) {
    payload.write2Unsigned(data.length);
    for (let i = 0; i < data.length; i++) {
        writeGravityObj(payload, data[i]);
    }
}

export function readGravityObj(payload: ByteBuffer): GravityObj {
    const x = payload.read4Float();
    const y = payload.read4Float();
    const pos = { x, y };
    const radius = payload.read4Unsigned();
    const force = payload.read4Float();
    return { pos, radius, force };
}

export function readGravityObjs(payload: ByteBuffer): GravityObj[] {
    const size = payload.read2Unsigned();
    const gravityObjs: GravityObj[] = [];
    for (let i = 0; i < size; i++) {
        gravityObjs.push(readGravityObj(payload));
    }
    return gravityObjs;
}

export function writePhysicsAttribute(
    payload: ByteBuffer,
    data: PhysicsAttribute,
) {
    payload.write4Float(data.position.x);
    payload.write4Float(data.position.y);
    payload.write4Float(data.velocity.x);
    payload.write4Float(data.velocity.y);
}

export function writeFrame(payload: ByteBuffer, frame: Frame) {
    payload.write2Unsigned(frame.id);
    writePhysicsAttribute(payload, frame.paddle1);
    payload.writeBoolean(frame.paddle1Hit);
    writePhysicsAttribute(payload, frame.paddle2);
    payload.writeBoolean(frame.paddle2Hit);
    writePhysicsAttribute(payload, frame.ball);
}

export function writeFrames(payload: ByteBuffer, frames: Frame[]) {
    payload.write2Unsigned(frames.length);
    for (let i = 0; i < frames.length; i++) {
        writeFrame(payload, frames[i]);
    }
}

export function readPhysicsAttribute(payload: ByteBuffer): PhysicsAttribute {
    const posX = payload.read4Float();
    const posY = payload.read4Float();
    const velocX = payload.read4Float();
    const velocY = payload.read4Float();
    return {
        position: { x: posX, y: posY },
        velocity: { x: velocX, y: velocY },
    };
}

export function readFrame(payload: ByteBuffer): Frame {
    const id = payload.read2Unsigned();
    const paddle1 = readPhysicsAttribute(payload);
    const paddle1Hit = payload.readBoolean();
    const paddle2 = readPhysicsAttribute(payload);
    const paddle2Hit = payload.readBoolean();
    const ball = readPhysicsAttribute(payload);
    return {
        id,
        paddle1,
        paddle1Hit,
        paddle2,
        paddle2Hit,
        ball,
    };
}

export function readFrames(payload: ByteBuffer): Frame[] {
    const size = payload.read2Unsigned();
    const frames: Frame[] = [];
    for (let i = 0; i < size; i++) {
        frames.push(readFrame(payload));
    }
    return frames;
}

export function readFrameWithoutBall(payload: ByteBuffer): Frame {
    const id = payload.read2Unsigned();
    const paddle1 = readPhysicsAttribute(payload);
    const paddle1Hit = payload.readBoolean();
    const paddle2 = readPhysicsAttribute(payload);
    const paddle2Hit = payload.readBoolean();
    const ball: PhysicsAttribute = {
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
    };
    return {
        id,
        paddle1,
        paddle1Hit,
        paddle2,
        paddle2Hit,
        ball,
    };
}

export function readFramesWithoutBall(payload: ByteBuffer): Frame[] {
    const size = payload.read2Unsigned();
    const frames: Frame[] = [];
    for (let i = 0; i < size; i++) {
        frames.push(readFrameWithoutBall(payload));
    }
    return frames;
}
