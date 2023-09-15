import { GameClientOpcode, GameServerOpcode } from "@common/game-opcodes";
import type {
    Frame,
    GravityObj,
    PhysicsAttribute,
} from "@common/game-physics-payloads";
import { readFrames, writeFrame } from "@common/game-physics-payloads";
import type { Vector } from "matter-js";
import Matter from "matter-js";
import { ByteBuffer } from "../akasha-lib/library/byte-buffer";
import { BattleField } from "@common/game-payloads";
import {
    handleResyncAll,
    handleResyncPart,
} from "@common/game-gateway-helper-client";

const PADDLE_IMAGE_SRCS = ["/game-chip-1_dummy.png", "/game-chip-4_dummy.png"];
const BALL_TEXTURE = "/ball.png";
const TEAM1 = 0;
const TEAM2 = 1;

const WIDTH = 1000;
const HEIGHT = 1920;
const BALL_RADIUS = 36;
const PADDLE_RADIUS = 80;
const GOAL_RADIUS = PADDLE_RADIUS + 8;
const WIN_SCORE = 5;

//ignore collision
const LINE_CATEGORY = 0x0002;

export class Game {
    //score
    private team1Score = 0;
    private team2Score = 0;
    //paddle1 velocity
    private myPaddleVelocity = { x: 0, y: 0 };
    private counterPaddleVelocity = { x: 0, y: 0 };
    // create engine
    private engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    private world = this.engine.world;
    // create renderer
    private render: Matter.Render;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D | null;
    // my paddle
    private myPaddleX = WIDTH / 2;
    private myPaddleY = HEIGHT - BALL_RADIUS - 50;
    private myPaddle = Matter.Bodies.circle(
        this.myPaddleX,
        this.myPaddleY,
        PADDLE_RADIUS,
        {
            isStatic: true,
            restitution: 1,
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0,
            render: {
                sprite: {
                    texture: PADDLE_IMAGE_SRCS[this.team],
                    yScale: 1,
                    xScale: 1,
                },
            },
        },
    );
    // counter paddle
    private counterPaddleX = WIDTH / 2;
    private counterPaddleY = BALL_RADIUS + 50;
    private counterPaddle = Matter.Bodies.circle(
        this.counterPaddleX,
        this.counterPaddleY,
        PADDLE_RADIUS,
        {
            isStatic: true,
            restitution: 1,
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0,
            render: {
                sprite: {
                    texture:
                        this.team === TEAM1
                            ? "/game-chip-4_dummy.png"
                            : "/game-chip-1_dummy.png",
                    yScale: 1,
                    xScale: 1,
                },
            },
        },
    );
    // create runner
    private runner = Matter.Runner.create();
    //ball
    private circle = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, BALL_RADIUS, {
        frictionStatic: 0,
        frictionAir: 0,
        friction: 0,
        restitution: 1,
        render: {
            sprite: {
                texture: BALL_TEXTURE,
                yScale: 0.2,
                xScale: 0.2,
            },
        },
    });
    private framesPerSecond = 60;
    private frames: Frame[] = [];
    private circleVelocity = { x: 15, y: 15 };
    private frameQueue: { resyncType: GameClientOpcode; frame: Frame }[] = [];
    private ignoreFrameIds: Set<number> = new Set<number>();

    constructor(
        private sendPayload: (value: ByteBuffer) => void,
        private readonly setNo: number,
        private readonly team: number,
        private readonly field: BattleField,
        private readonly gravity: GravityObj[],
        canvasRef: React.RefObject<HTMLCanvasElement>,
    ) {
        if (field !== BattleField.SQUARE && field !== BattleField.ROUND) {
            // 필드에 이상한 문자열이 들어갔을때 에러처리;
        }
        if (this.team === TEAM2) {
            // 원점대칭할 점
            this.originSymmetry(this.circleVelocity);
            for (let i = 0; i < this.gravity.length; i++) {
                this.midpointSymmetry(this.gravity[i].pos);
            }
        }
        // XXX
        if (canvasRef.current === null) {
            throw new Error("no canvas");
        }
        this.render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            canvas: canvasRef.current, // XXX
            options: {
                width: WIDTH,
                height: HEIGHT,
                showAngleIndicator: true,
                showCollisions: true,
                wireframes: false,
            },
        });
        this.canvas = this.render.canvas;
        this.canvasContext = this.canvas.getContext("2d");
        // XXX
        if (this.canvasContext === null) {
            throw new Error("no canvas");
        }

        this.canvasContext.font = "30px arial";
        Matter.Body.setInertia(this.circle, 0.00000001);
        Matter.Body.setVelocity(this.circle, this.circleVelocity);
    }

    private pasteFrame(frame: Frame) {
        this.frames[frame.id] = frame;
    }

    private midpointSymmetry(point: { x: number; y: number }) {
        point.x = WIDTH - point.x;
        point.y = HEIGHT - point.y;
    }

    private originSymmetry(point: { x: number; y: number }) {
        point.x *= -1;
        point.y *= -1;
    }

    private calculatePos(event: TouchEvent | MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        if (event instanceof TouchEvent) {
            const mouseX = event.targetTouches[0].clientX - rect.left;
            const mouseY = event.targetTouches[0].clientY - rect.top;
            return {
                x: mouseX,
                y: mouseY,
            };
        }
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        return {
            x: mouseX,
            y: mouseY,
        };
    }

    //ball reflection
    private reflection(normalVec: { x: number; y: number }, ball: Matter.Body) {
        const velocity = Matter.Body.getVelocity(ball);
        if (normalVec.x * velocity.x + normalVec.y * velocity.y >= 0) {
            const theta = Math.atan2(normalVec.y, normalVec.x);
            const alpha = Math.atan2(velocity.y, velocity.x);
            const newVx =
                velocity.x * Math.cos(2 * theta - 2 * alpha) -
                velocity.y * Math.sin(2 * theta - 2 * alpha);
            const newVy =
                velocity.x * Math.sin(2 * theta - 2 * alpha) +
                velocity.y * Math.cos(2 * theta - 2 * alpha);
            Matter.Body.setVelocity(ball, {
                x: newVx * -1.05,
                y: newVy * -1.05,
            });
        }
    }

    private wallReflection(velocity: { x: number; y: number }) {
        //반사!
        if (this.circle.position.x < BALL_RADIUS) {
            Matter.Body.setPosition(this.circle, {
                x: BALL_RADIUS,
                y: this.circle.position.y,
            });
            Matter.Body.setVelocity(this.circle, {
                x: velocity.x * -1,
                y: velocity.y * 1,
            });
        } else if (this.circle.position.x > WIDTH - BALL_RADIUS) {
            Matter.Body.setPosition(this.circle, {
                x: WIDTH - BALL_RADIUS,
                y: this.circle.position.y,
            });
            Matter.Body.setVelocity(this.circle, {
                x: velocity.x * -1,
                y: velocity.y * 1,
            });
        }
    }

    private makePointInEllipse(theta: number): { x: number; y: number } {
        const distance =
            ((WIDTH / 2) * (HEIGHT / 2)) /
            Math.sqrt(
                ((HEIGHT / 2) * Math.cos(theta)) ** 2 +
                    ((WIDTH / 2) * Math.sin(theta)) ** 2,
            );
        return { x: distance * Math.cos(theta), y: distance * Math.sin(theta) };
    }

    private determinantNormal(
        circlePos: { x: number; y: number },
        pointInEllipse: { x: number; y: number },
    ): number {
        return (
            (WIDTH / 2) ** 2 *
                pointInEllipse.y *
                (pointInEllipse.x - circlePos.x) -
            (HEIGHT / 2) ** 2 *
                pointInEllipse.x *
                (pointInEllipse.y - circlePos.y)
        );
    }

    private review(
        circlePos: { x: number; y: number },
        pointInEllipse: { x: number; y: number },
    ): number {
        return (
            ((WIDTH / 2) ** 2 *
                pointInEllipse.y *
                (pointInEllipse.x - circlePos.x)) /
            ((HEIGHT / 2) ** 2 *
                pointInEllipse.x *
                (pointInEllipse.y - circlePos.y))
        );
    }

    private oneQuadrantLogic(circlePos: { x: number; y: number }): number {
        let upper = Math.PI / 2;
        let lower = 0;
        while (true) {
            const theta = (upper + lower) / 2;
            const pointInEllipse = this.makePointInEllipse(theta);
            const num = this.review(circlePos, pointInEllipse);
            if ((upper - lower) * (180 / Math.PI) < 0.0005) {
                if (num > 1.1 || num < 0.9) {
                    upper = Math.PI * (3 / 4);
                    lower = (-1 * Math.PI) / 4;
                } else {
                    return theta;
                }
            }
            if (this.determinantNormal(circlePos, pointInEllipse) < 0) {
                upper = theta;
            } else if (this.determinantNormal(circlePos, pointInEllipse) > 0) {
                lower = theta;
            } else if (0.95 < num && num < 1.05) {
                return theta;
            }
        }
    }

    private ellipseReflection() {
        const circlePos = {
            x: this.circle.position.x - WIDTH / 2,
            y: this.circle.position.y - HEIGHT / 2,
        };
        const normal = { x: 0, y: 0 };
        // x축 대칭
        circlePos.y *= -1;
        if (0 < circlePos.x && 0 < circlePos.y) {
            // 1사분면
            const theta = this.oneQuadrantLogic(circlePos);
            const pointInEllipse = this.makePointInEllipse(theta);
            normal.x = pointInEllipse.x - circlePos.x;
            normal.y = pointInEllipse.y - circlePos.y;
        } else if (0 > circlePos.x && 0 < circlePos.y) {
            // 2사분면
            circlePos.x *= -1;
            const theta = this.oneQuadrantLogic(circlePos);
            const pointInEllipse = this.makePointInEllipse(theta);
            normal.x = pointInEllipse.x - circlePos.x;
            normal.y = pointInEllipse.y - circlePos.y;
            normal.x *= -1;
        } else if (0 > circlePos.x && 0 > circlePos.y) {
            // 3사분면
            circlePos.x *= -1;
            circlePos.y *= -1;
            const theta = this.oneQuadrantLogic(circlePos);
            const pointInEllipse = this.makePointInEllipse(theta);
            normal.x = pointInEllipse.x - circlePos.x;
            normal.y = pointInEllipse.y - circlePos.y;
            normal.x *= -1;
            normal.y *= -1;
        } else if (0 < circlePos.x && 0 > circlePos.y) {
            // 4사분면
            circlePos.y *= -1;
            const theta = this.oneQuadrantLogic(circlePos);
            const pointInEllipse = this.makePointInEllipse(theta);
            normal.x = pointInEllipse.x - circlePos.x;
            normal.y = pointInEllipse.y - circlePos.y;
            normal.y *= -1;
        }
        if (this.circle.position.y === 0 || this.circle.position.y === HEIGHT) {
            Matter.Body.setVelocity(this.circle, {
                x: this.circle.velocity.x,
                y: this.circle.velocity.y * -1,
            });
        }
        if (this.circle.position.x === 0 || this.circle.position.x === WIDTH) {
            Matter.Body.setVelocity(this.circle, {
                x: this.circle.velocity.x * -1,
                y: this.circle.velocity.y,
            });
        }
        // 다시 x축 대칭!
        normal.y *= -1;

        const inOutCheck = this.ellipseInOut(this.circle.position);
        if (
            Math.sqrt(normal.x ** 2 + normal.y ** 2) <= BALL_RADIUS &&
            inOutCheck < 1
        ) {
            const velocity = Matter.Body.getVelocity(this.circle);
            if (normal.x * velocity.x + normal.y * velocity.y >= 0) {
                const theta = Math.atan2(normal.y, normal.x);
                const alpha = Math.atan2(velocity.y, velocity.x);
                const newVx =
                    velocity.x * Math.cos(2 * theta - 2 * alpha) -
                    velocity.y * Math.sin(2 * theta - 2 * alpha);
                const newVy =
                    velocity.x * Math.sin(2 * theta - 2 * alpha) +
                    velocity.y * Math.cos(2 * theta - 2 * alpha);
                Matter.Body.setVelocity(this.circle, {
                    x: newVx * -1,
                    y: newVy * -1,
                });
            }
        } else if (inOutCheck >= 1) {
            Matter.Body.setPosition(this.circle, {
                x: this.circle.position.x + 5 * normal.x,
                y: this.circle.position.y + 5 * normal.y,
            });
        }
    }

    private setEllipse() {
        const ellipseMajorAxis = HEIGHT;
        const ellipseMinorAxis = WIDTH;
        const ellipseVerticesArray: Vector[] = [];
        const ellipseVertices = 1000;
        const focus = Math.sqrt(
            (ellipseMajorAxis / 2) ** 2 - (ellipseMinorAxis / 2) ** 2,
        );
        const focusPos1 = HEIGHT / 2 + focus;
        const focusPos2 = HEIGHT / 2 - focus;
        for (let i = 0; i < 350; i++) {
            const a = Matter.Bodies.circle(
                WIDTH / 2 + Math.cos(i) * (ellipseMinorAxis / 2 + 20),
                HEIGHT / 2 + Math.sin(i) * (ellipseMajorAxis / 2 + 20),
                20,
                {
                    isStatic: true,
                    render: {
                        fillStyle: "#f55a3c",
                    },
                },
            );
            Matter.Composite.add(this.world, a);
        }
        for (let i = 0; i < ellipseVertices; i++) {
            const x = (ellipseMinorAxis / 2) * Math.cos(i);
            const y = (ellipseMajorAxis / 2) * Math.sin(i);
            ellipseVerticesArray.push({ x: x, y: y });
        }

        const ellipse = Matter.Bodies.fromVertices(
            WIDTH / 2,
            HEIGHT / 2,
            [ellipseVerticesArray],
            {
                isStatic: true,
                collisionFilter: {
                    mask: LINE_CATEGORY,
                },
                // render: {
                // 	sprite: {
                // 		texture: "/background.png",
                // 		yScale: 0.22,
                // 		xScale: 0.18,
                // 	},
                // }
            },
        );
        Matter.Composite.add(this.world, ellipse);
        const goal1 = Matter.Bodies.circle(WIDTH / 2, focusPos1, GOAL_RADIUS, {
            isStatic: true,
            collisionFilter: {
                mask: LINE_CATEGORY,
            },
            render: {
                sprite: {
                    texture: "/blackhole.png",
                    yScale: 0.45,
                    xScale: 0.45,
                },
            },
        });
        const goal2 = Matter.Bodies.circle(WIDTH / 2, focusPos2, GOAL_RADIUS, {
            isStatic: true,
            collisionFilter: {
                mask: LINE_CATEGORY,
            },
            render: {
                sprite: {
                    texture: "/blackhole.png",
                    yScale: 0.45,
                    xScale: 0.45,
                },
            },
        });
        Matter.Composite.add(this.world, [goal1, goal2]);
    }

    private limitVelocity() {
        //속도제한
        const limit = 35;
        if (this.circle.velocity.x > limit) {
            Matter.Body.setVelocity(this.circle, {
                x: limit,
                y: this.circle.velocity.y,
            });
        }
        if (this.circle.velocity.y > limit) {
            Matter.Body.setVelocity(this.circle, {
                x: this.circle.velocity.x,
                y: limit,
            });
        }
    }

    private drawScore() {
        if (this.canvasContext === null) return;
        const team1DrawPos = this.team === TEAM1 ? 1900 : 25;
        const team2DrawPos = team1DrawPos === 1900 ? 25 : 1900;
        this.canvasContext.fillText(
            "Team 2 score: " + this.team2Score + `/${WIN_SCORE}`,
            WIDTH / 2 - 150,
            team2DrawPos,
        );
        this.canvasContext.fillText(
            "Team 1 score: " + this.team1Score + `/${WIN_SCORE}`,
            WIDTH / 2 - 150,
            team1DrawPos,
        );
        if (this.team1Score !== 5 || this.team2Score !== 5) {
            this.canvasContext.fillText(
                `Set: ${this.setNo}`,
                WIDTH / 2 - 50,
                HEIGHT / 2 + 25,
            );
        }
    }

    private judgeWinner() {
        if (this.canvasContext === null) return;
        if (this.team1Score >= WIN_SCORE) {
            this.canvasContext.fillText(
                "Team 1 Wins!",
                WIDTH / 2 - 100,
                HEIGHT / 2 - 25,
            );
            Matter.Engine.clear(this.engine);
            Matter.Render.stop(this.render);
            Matter.Runner.stop(this.runner);
        } else if (this.team2Score >= WIN_SCORE) {
            this.canvasContext.fillText(
                "Team 2 Wins!",
                WIDTH / 2 - 100,
                HEIGHT / 2 - 25,
            );
            Matter.Engine.clear(this.engine);
            Matter.Render.stop(this.render);
            Matter.Runner.stop(this.runner);
        }
    }

    private reverseFrame(frame: Frame) {
        this.midpointSymmetry(frame.paddle1.position);
        this.originSymmetry(frame.paddle1.velocity);
        this.midpointSymmetry(frame.paddle2.position);
        this.originSymmetry(frame.paddle2.velocity);
        this.midpointSymmetry(frame.ball.position);
        this.originSymmetry(frame.ball.velocity);
    }

    private ellipseInOut(point: { x: number; y: number }) {
        return (
            (point.x - WIDTH / 2) ** 2 / (WIDTH / 2) ** 2 +
            (point.y - HEIGHT / 2) ** 2 / (HEIGHT / 2) ** 2
        );
    }

    private sendFrame(paddle1Hit: boolean, paddle2Hit: boolean) {
        if (this.team1Score === WIN_SCORE || this.team2Score === WIN_SCORE) {
            return;
        }
        const myPaddle: PhysicsAttribute = {
            position: {
                x: this.myPaddle.position.x,
                y: this.myPaddle.position.y,
            },
            velocity: {
                x: this.myPaddleVelocity.x,
                y: this.myPaddleVelocity.y,
            },
        };
        const counterPaddle: PhysicsAttribute = {
            position: {
                x: this.counterPaddle.position.x,
                y: this.counterPaddle.position.y,
            },
            velocity: { x: 0, y: 0 },
        };
        const frame: Frame = {
            id: this.frames.length,
            paddle1: this.team === TEAM1 ? myPaddle : counterPaddle,
            paddle1Hit,
            paddle2: this.team === TEAM1 ? counterPaddle : myPaddle,
            paddle2Hit,
            ball: {
                position: {
                    x: this.circle.position.x + this.circle.velocity.x,
                    y: this.circle.position.y + this.circle.velocity.y,
                },
                velocity: {
                    x: this.circle.velocity.x,
                    y: this.circle.velocity.y,
                },
            },
        };
        if (this.team === TEAM2) {
            this.reverseFrame(frame);
        }
        this.frames.push(frame);
        const buf = ByteBuffer.createWithOpcode(GameServerOpcode.FRAME);
        buf.write1(this.setNo);
        buf.write1(this.team);
        writeFrame(buf, frame);
        this.sendPayload(buf);
    }

    //gravity
    private allAttractive() {
        for (let i = 0; i < this.gravity.length; i++) {
            this.attractive(
                this.gravity[i].pos,
                this.circle,
                this.gravity[i].force,
            );
        }
    }

    private attractive(
        attractiveCenter: { x: number; y: number },
        body: Matter.Body,
        gravityConstant: number,
    ) {
        const normal = {
            x: attractiveCenter.x - body.position.x,
            y: attractiveCenter.y - body.position.y,
        };
        const distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        const force = {
            x: (gravityConstant * normal.x) / (distance * +1),
            y: (gravityConstant * normal.y) / (distance + 1),
        };
        Matter.Body.setVelocity(body, {
            x: body.velocity.x + force.x / 3,
            y: body.velocity.y + force.y / 3,
        });
    }

    private setGravity() {
        // // gravity object
        for (let i = 0; i < this.gravity.length; i++) {
            const attractive = Matter.Bodies.circle(
                this.gravity[i].pos.x,
                this.gravity[i].pos.y,
                this.gravity[i].radius,
                {
                    isStatic: true,
                    collisionFilter: {
                        mask: LINE_CATEGORY,
                    },
                    render: {
                        sprite: {
                            texture: i === 0 ? "/planet1.png" : "/planet2.png",
                            yScale: 0.2,
                            xScale: 0.2,
                        },
                    },
                },
            );
            Matter.Composite.add(this.world, attractive);
        }
    }

    resyncAllOpcodeHandler(buf: ByteBuffer) {
        const frames = handleResyncAll(buf);
        const size = frames.length;
        const lastSyncFrameId = frames[frames.length - 1].id;
        const diff = this.frames.length - lastSyncFrameId;
        if (diff > 1) {
            for (let i = 1; i < diff; i++) {
                this.ignoreFrameIds.add(lastSyncFrameId + i);
            }
            this.frames.splice(lastSyncFrameId + 1, diff - 1);
        } // 전부 리싱크하는 경우 그 이후의 프레임은 무시하고 삭제하도록 설정
        for (let i = 0; i < size; i++) {
            if (this.ignoreFrameIds.has(frames[i].id)) {
                this.ignoreFrameIds.delete(frames[i].id);
                continue;
            }
            if (this.team === TEAM2) {
                this.reverseFrame(frames[i]);
            }
            this.pasteFrame(frames[i]);
            this.frameQueue.push({
                resyncType: GameClientOpcode.RESYNC_ALL,
                frame: frames[i],
            });
        }
    }

    resyncPartOpcodeHandler(buf: ByteBuffer) {
        const frames = handleResyncPart(buf);
        const size = frames.length;
        for (let i = 0; i < size; i++) {
            if (this.ignoreFrameIds.has(frames[i].id)) {
                this.ignoreFrameIds.delete(frames[i].id);
                if (this.team === TEAM2) {
                    this.reverseFrame(frames[i]);
                }
                this.frameQueue.push({
                    resyncType: GameClientOpcode.RESYNC_PARTOF,
                    frame: frames[i],
                });
            } // 무시하는 프레임에 등록된 경우 상대 패들만 싱크하고 나머지는 무시
            else {
                if (this.team === TEAM2) {
                    this.reverseFrame(frames[i]);
                }
                this.pasteFrame(frames[i]);
                this.frameQueue.push({
                    resyncType: GameClientOpcode.RESYNC_PART,
                    frame: frames[i],
                });
            }
        }
    }

    start() {
        Matter.Render.run(this.render);
        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            event.preventDefault();
            const prevTimestamp = Date.now();
            const prevPointX = this.myPaddle.position.x;
            const prevPointY = this.myPaddle.position.y;
            const mousePos = this.calculatePos(event);
            this.myPaddleY = mousePos.y - PADDLE_RADIUS / 2;
            this.myPaddleX = mousePos.x - PADDLE_RADIUS / 2;
            Matter.Body.setPosition(this.myPaddle, {
                x: this.myPaddleX,
                y: this.myPaddleY,
            });
            // 패들 중앙선 침범 금지~!
            if (this.myPaddle.position.y < HEIGHT / 2 + PADDLE_RADIUS) {
                Matter.Body.setPosition(this.myPaddle, {
                    x: this.myPaddle.position.x,
                    y: HEIGHT / 2 + PADDLE_RADIUS,
                });
            }
            const deltaT = Date.now() - prevTimestamp + 1;
            this.myPaddleVelocity = {
                x: (this.myPaddle.position.x - prevPointX) / deltaT,
                y: (this.myPaddle.position.y - prevPointY) / deltaT,
            };
        });
        this.canvas.addEventListener("touchmove", (event: TouchEvent) => {
            event.preventDefault();
            const prevTimestamp = Date.now();
            const prevPointX = this.myPaddle.position.x;
            const prevPointY = this.myPaddle.position.y;
            const mousePos = this.calculatePos(event);
            this.myPaddleY = mousePos.y - PADDLE_RADIUS / 2;
            this.myPaddleX = mousePos.x - PADDLE_RADIUS / 2;
            Matter.Body.setPosition(this.myPaddle, {
                x: this.myPaddleX,
                y: this.myPaddleY,
            });
            // 패들 중앙선 침범 금지~!
            if (this.myPaddle.position.y < HEIGHT / 2 + PADDLE_RADIUS) {
                Matter.Body.setPosition(this.myPaddle, {
                    x: this.myPaddle.position.x,
                    y: HEIGHT / 2 + PADDLE_RADIUS,
                });
            }
            const deltaT = Date.now() - prevTimestamp + 1;
            this.myPaddleVelocity = {
                x: (this.myPaddle.position.x - prevPointX) / deltaT,
                y: (this.myPaddle.position.y - prevPointY) / deltaT,
            };
        });
        //add Ellipse
        if (this.field === BattleField.ROUND) {
            this.setEllipse();
        }
        //중력객체 추가
        if (this.gravity.length > 0) {
            this.setGravity();
        }
        //add paddles
        Matter.Composite.add(this.world, this.myPaddle);
        Matter.Composite.add(this.world, this.counterPaddle);
        //add line
        Matter.Composite.add(
            this.world,
            Matter.Bodies.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, 2, {
                isStatic: true,
                collisionFilter: {
                    mask: LINE_CATEGORY,
                },
            }),
        );
        Matter.Runner.run(this.runner, this.engine);
        //add ball
        Matter.Composite.add(this.world, this.circle);
        Matter.Render.lookAt(this.render, {
            min: { x: 0, y: 0 },
            max: { x: WIDTH, y: HEIGHT },
        });

        // Event On!
        Matter.Events.on(this.runner, "tick", (_event: Event) => {
            // XXX
            if (this.canvasContext === null) {
                throw new Error("no canvas");
            }
            const size = this.frameQueue.length;
            if (size > 0) {
                for (let i = 0; i < size; i++) {
                    if (
                        this.frameQueue[i].resyncType ===
                        GameClientOpcode.RESYNC_PART
                    ) {
                        const frame = this.frameQueue[i].frame;
                        // setTimeout(() => {
                        Matter.Body.setPosition(
                            this.counterPaddle,
                            this.team === TEAM1
                                ? frame.paddle2.position
                                : frame.paddle1.position,
                        );
                        Matter.Body.setVelocity(
                            this.counterPaddle,
                            this.team === TEAM1
                                ? frame.paddle2.velocity
                                : frame.paddle1.velocity,
                        );
                        // }, 1000 / (this.framesPerSecond * size) * i);
                    } else if (
                        this.frameQueue[i].resyncType ===
                        GameClientOpcode.RESYNC_PARTOF
                    ) {
                        const frame = this.frameQueue[i].frame;
                        // setTimeout(() => {
                        Matter.Body.setPosition(
                            this.counterPaddle,
                            this.team === TEAM1
                                ? frame.paddle2.position
                                : frame.paddle1.position,
                        );
                        Matter.Body.setVelocity(
                            this.counterPaddle,
                            this.team === TEAM1
                                ? frame.paddle2.velocity
                                : frame.paddle1.velocity,
                        );

                        // }, 1000 / (this.framesPerSecond * size) * i);
                    } else if (
                        this.frameQueue[i].resyncType ===
                        GameClientOpcode.RESYNC_ALL
                    ) {
                        const frame = this.frameQueue[i].frame;
                        // setTimeout(() => {
                        Matter.Body.setPosition(
                            this.counterPaddle,
                            this.team === TEAM1
                                ? frame.paddle2.position
                                : frame.paddle1.position,
                        );
                        Matter.Body.setVelocity(
                            this.counterPaddle,
                            this.team === TEAM1
                                ? frame.paddle2.velocity
                                : frame.paddle1.velocity,
                        );
                        Matter.Body.setPosition(
                            this.circle,
                            frame.ball.position,
                        );
                        Matter.Body.setVelocity(
                            this.circle,
                            frame.ball.velocity,
                        );
                        // }, 1000 / (this.framesPerSecond * size) * i);
                    }
                }
                this.frameQueue.splice(0, size);
            }
            const collided =
                Matter.Collision.collides(this.myPaddle, this.circle, 0) ??
                Matter.Collision.collides(this.counterPaddle, this.circle, 0);
            const velocity = Matter.Body.getVelocity(this.circle);
            let paddle1Hit = false;
            let paddle2Hit = false;

            if (collided?.collided === true) {
                if (collided.bodyA.position.y > HEIGHT / 2) {
                    paddle1Hit = true;
                } else {
                    paddle2Hit = true;
                }
                this.reflection(collided.normal, this.circle);
                Matter.Body.setVelocity(this.circle, {
                    x: this.circle.velocity.x + this.myPaddleVelocity.x / 8,
                    y: this.circle.velocity.y + this.myPaddleVelocity.y / 8,
                });
                this.myPaddleVelocity = { x: 0, y: 0 };
            }
            //paddle2의 속도추가
            Matter.Body.setPosition(this.counterPaddle, {
                x: this.counterPaddle.position.x + this.counterPaddleVelocity.x,
                y: this.counterPaddle.position.y + this.counterPaddleVelocity.y,
            });
            // 타원 반사!
            if (this.field === BattleField.ROUND) {
                this.ellipseReflection();
            }
            this.wallReflection(velocity);
            //속도제한
            this.limitVelocity();
            //중력!
            this.allAttractive();

            //프레임 보내기
            this.sendFrame(paddle1Hit, paddle2Hit);

            //승점계산
            this.judgeWinner();
            this.drawScore();
        });
    }
}
