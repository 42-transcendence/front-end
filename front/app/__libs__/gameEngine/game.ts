
import Matter, { Vector } from "matter-js";
import { RefObject } from "react";
import { ByteBuffer } from "../akasha-lib";

function readPhysicsAttribute(payload: ByteBuffer): PhysicsAttribute {
	const posX = payload.read4();
	const posY = payload.read4();
	const velocX = payload.read8Float();
	const velocY = payload.read8Float();
	return { position: { x: posX, y: posY }, velocity: { x: velocX, y: velocY } };
}

function readFrame(payload: ByteBuffer): Frame {
	const id = payload.read4Unsigned();
	const paddle1 = readPhysicsAttribute(payload);
	const paddle1Hit = payload.readBoolean();
	const paddle2 = readPhysicsAttribute(payload);
	const paddle2Hit = payload.readBoolean();
	const ball = readPhysicsAttribute(payload);
	const player1Score = payload.read1();
	const player2Score = payload.read1();
	return { id, paddle1, paddle1Hit, paddle2, paddle2Hit, ball, player1Score, player2Score };
}

function readFrames(payload: ByteBuffer): Frame[] {
	const size = payload.read4Unsigned();
	const frames: Frame[] = []
	for (let i = 0; i < size; i++) {
		frames.push(readFrame(payload));
	}
	return frames;
}

function writePhysicsAttribute(payload: ByteBuffer, data: PhysicsAttribute) {
	payload.write4(data.position.x);
	payload.write4(data.position.y);
	payload.write8Float(data.velocity.x);
	payload.write8Float(data.velocity.y);
}

function writeFrame(payload: ByteBuffer, frame: Frame) {
	payload.write4Unsigned(frame.id);
	writePhysicsAttribute(payload, frame.paddle1);
	payload.writeBoolean(frame.paddle1Hit);
	writePhysicsAttribute(payload, frame.paddle2);
	payload.writeBoolean(frame.paddle2Hit);
	writePhysicsAttribute(payload, frame.ball);
	payload.write1(frame.player1Score);
	payload.write1(frame.player2Score);
}

const enum GameServerOpcode {
	HANDSHAKE,
	START,
	JOIN,
	FRAME
}

const enum GameClientOpcode {
	INITIALIZE,
	ACCEPT,
	REJECT,
	START,
	RESYNC,
	SYNC,
	WIN,
	LOSE,
	DRAW
}

// replay
type PhysicsAttribute = {
	position: { x: number, y: number },
	velocity: { x: number, y: number },
}
type Frame = {
	id: number,
	paddle1: PhysicsAttribute,
	paddle1Hit: boolean,
	paddle2: PhysicsAttribute,
	paddle2Hit: boolean,
	ball: PhysicsAttribute,
	player1Score: number,
	player2Score: number
}

export class Game {
	private WIDTH = 1000;
	private HEIGHT = 1920;
	private BALL_RADIUS = 36;
	private PADDLE_RADIUS = 80;
	private WIN_SCORE = 5;
	//score
	private player1Score = 0;
	private player2Score = 0;
	//paddle1 velocity
	private myPaddleVelocity = { x: 0, y: 0 };
	private counterPaddleVelocity = { x: 0, y: 0 };
	//ignore collision
	private lineCategory = 0x0002;
	// create engine
	private engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
	private world = this.engine.world;
	// create renderer
	private render: Matter.Render;
	private canvas: HTMLCanvasElement;
	private canvasContext: CanvasRenderingContext2D | null;
	// my paddle
	private myPaddleX = this.WIDTH / 2;
	private myPaddleY = this.HEIGHT - this.BALL_RADIUS - 50;
	private myPaddle = Matter.Bodies.circle(
		this.myPaddleX,
		this.myPaddleY,
		this.PADDLE_RADIUS,
		{
			isStatic: true,
			restitution: 1,
			frictionStatic: 0,
			frictionAir: 0,
			friction: 0,
		},
	);
	// counter paddle
	private counterPaddleX = this.WIDTH / 2;
	private counterPaddleY = this.BALL_RADIUS + 50;
	private counterPaddle = Matter.Bodies.circle(
		this.counterPaddleX,
		this.counterPaddleY,
		this.PADDLE_RADIUS,
		{
			isStatic: true,
			restitution: 1,
			frictionStatic: 0,
			frictionAir: 0,
			friction: 0,
		},
	);
	// create runner
	private runner = Matter.Runner.create();
	//ball
	private circle = Matter.Bodies.circle(this.WIDTH / 2, this.HEIGHT / 2, this.BALL_RADIUS, {
		frictionStatic: 0,
		frictionAir: 0,
		friction: 0,
		restitution: 1,
	});
	private framesPerSecond = 60;
	private frames: Frame[] = [];
	private circleVelocity = { x: 15, y: 15 };

	constructor(private websocket: WebSocket, private readonly player: number, canvasRef: RefObject<HTMLCanvasElement>) {
		if (this.player !== 1 && this.player !== 2) {
			// 플레이어에 이상한 넘버가 들어갔을때 에러처리;
		}
		if (this.player === 2) { // 원점대칭할 점
			this.originSymmetry(this.circleVelocity);
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
				width: this.WIDTH,
				height: this.HEIGHT,
				showAngleIndicator: true,
				showCollisions: true,
			},
		});
		this.canvas = this.render.canvas;
		this.canvasContext = this.canvas.getContext("2d");
		// XXX
		if (this.canvasContext === null) {
			throw new Error("no canvas");
		}

		this.canvasContext.font = "30px arial";
		Matter.Body.setInertia(this.circle, 0.00001);
		Matter.Body.setVelocity(this.circle, this.circleVelocity);

		websocket.binaryType = 'arraybuffer';
		websocket.onmessage = (event: MessageEvent<ArrayBuffer>) => {
			const buf = ByteBuffer.from(event.data);
			const opcode = buf.readOpcode();
			if (opcode === GameClientOpcode.SYNC) {
				const frame: Frame = readFrame(buf);
				if (this.player === 2) {
					this.reverseFrame(frame);
				}
				//프레임 붙여넣기
				this.pasteFrame(frame);
				//프레임 드로잉
				this.drawFrame(frame);
			}
			else if (opcode === GameClientOpcode.RESYNC) {
				const frames: Frame[] = readFrames(buf);
				const size = frames.length;
				for (let i = 0; i < size; i++) {
					if (this.player === 2) {
						this.reverseFrame(frames[i]);
					}
					this.pasteFrame(frames[i]);
					setTimeout(() => {
						Matter.Body.setPosition(this.counterPaddle, this.player === 1 ? frames[i].paddle2.position : frames[i].paddle1.position);
						Matter.Body.setVelocity(this.counterPaddle, this.player === 1 ? frames[i].paddle2.velocity : frames[i].paddle1.velocity);
						Matter.Body.setPosition(this.circle, frames[i].ball.position);
						Matter.Body.setVelocity(this.circle, frames[i].ball.velocity);
						this.player1Score = frames[i].player1Score;
						this.player2Score = frames[i].player2Score;
					}, 1000 / (this.framesPerSecond * size) * i) //TODO 프레임이 꼬이는지 확인하기! - tick에 의한 드로잉과 setTimeout에 의한 프레임 드로잉이 서로 섞이지 않는지 실제로 확인해보기
				}
			}
		}
	}

	private pasteFrame(frame: Frame) {
		this.frames[frame.id] = frame;
	}

	private drawFrame(frame: Frame) {
		Matter.Body.setPosition(this.counterPaddle, this.player === 1 ? frame.paddle2.position : frame.paddle1.position);
		Matter.Body.setVelocity(this.counterPaddle, this.player === 1 ? frame.paddle2.velocity : frame.paddle1.velocity);
		Matter.Body.setPosition(this.circle, frame.ball.position);
		Matter.Body.setVelocity(this.circle, frame.ball.velocity);
		this.player1Score = frame.player1Score;
		this.player2Score = frame.player2Score;
	}

	private midpointSymmetry(point: { x: number, y: number }) {
		point.x = this.WIDTH - point.x;
		point.y = this.HEIGHT - point.y;
	}

	private originSymmetry(point: { x: number, y: number }) {
		point.x *= -1;
		point.y *= -1;
	}

	private calculateMousePos(event: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		return {
			x: mouseX,
			y: mouseY,
		};
	}

	//ball reflection
	private reflection(normalVec: { x: number, y: number }, ball: Matter.Body) {
		const velocity = Matter.Body.getVelocity(ball);
		if (normalVec.x * velocity.x + normalVec.y * velocity.y >= 0) {
			const theta = Math.atan2(normalVec.y, normalVec.x);
			const alpha = Math.atan2(velocity.y, velocity.x);
			const newVx = velocity.x * Math.cos(2 * theta - 2 * alpha) - velocity.y * Math.sin(2 * theta - 2 * alpha);
			const newVy = velocity.x * Math.sin(2 * theta - 2 * alpha) + velocity.y * Math.cos(2 * theta - 2 * alpha);
			Matter.Body.setVelocity(ball, { x: newVx * -1.05, y: newVy * -1.05 });
		}
	}

	private wallReflection(velocity: { x: number, y: number }) {
		//반사!
		if (this.circle.position.x < this.BALL_RADIUS) {
			Matter.Body.setPosition(this.circle, {
				x: this.BALL_RADIUS,
				y: this.circle.position.y,
			});
			Matter.Body.setVelocity(this.circle, {
				x: velocity.x * -1,
				y: velocity.y * 1,
			});
		} else if (this.circle.position.x > this.WIDTH - this.BALL_RADIUS) {
			Matter.Body.setPosition(this.circle, {
				x: this.WIDTH - this.BALL_RADIUS,
				y: this.circle.position.y,
			});
			Matter.Body.setVelocity(this.circle, {
				x: velocity.x * -1,
				y: velocity.y * 1,
			});
		}
	}

	private makePointInEllipse(theta: number): { x: number, y: number } {
		const distance = ((this.WIDTH / 2) * (this.HEIGHT / 2)) / (Math.sqrt((((this.HEIGHT / 2) * Math.cos(theta)) ** 2) + (((this.WIDTH / 2) * Math.sin(theta)) ** 2)))
		return { x: distance * Math.cos(theta), y: distance * Math.sin(theta) };
	}

	private determinantNormal(circlePos: { x: number, y: number }, pointInEllipse: { x: number, y: number }): number {
		console.log((((this.WIDTH / 2) ** 2) * pointInEllipse.y * (pointInEllipse.x - circlePos.x)) / (((this.HEIGHT / 2) ** 2) * pointInEllipse.x * (pointInEllipse.y - circlePos.y)), "re")
		// console.log(`x:`, ((this.WIDTH / 2) ** 2) * pointInEllipse.y * (pointInEllipse.x - circlePos.x), "y: ", ((this.HEIGHT / 2) ** 2) * pointInEllipse.x * (pointInEllipse.y - circlePos.y))
		// console.log("circlePos: ", circlePos, "pointInEllipse: ", pointInEllipse);
		return (((this.WIDTH / 2) ** 2) * pointInEllipse.y * (pointInEllipse.x - circlePos.x)) - (((this.HEIGHT / 2) ** 2) * pointInEllipse.x * (pointInEllipse.y - circlePos.y));
	}

	private oneQuadrantLogic(circlePos: { x: number, y: number }): number {
		let upper = Math.atan(circlePos.y / circlePos.x);
		let lower = upper - Math.asin(this.BALL_RADIUS / Math.sqrt(circlePos.x ** 2 + circlePos.y ** 2));
		if (lower < 0) {
			lower = 0;
		}
		while (true) {
			const theta = (upper + lower) / 2;
			const pointInEllipse = this.makePointInEllipse(theta);
			if ((upper - lower) * (180 / Math.PI) < 0.0001) {
				// console.log(upper, lower)
				// console.log("check", this.determinantNormal(circlePos, pointInEllipse));
				// console.log((pointInEllipse.x / (this.WIDTH / 2)) ** 2 + (pointInEllipse.y / (this.HEIGHT / 2)) ** 2)
				return theta
			}
			if (this.determinantNormal(circlePos, pointInEllipse) < 0) {
				upper = theta;
			}
			else if (this.determinantNormal(circlePos, pointInEllipse) > 0) {
				lower = theta;
			}
			else {
				return theta
			}
			console.log("in");
		}
	}

	private ellipseReflection() {
		const circlePos = { x: this.circle.position.x - this.WIDTH / 2, y: this.circle.position.y - this.HEIGHT / 2 };
		const newCirclePos = { x: 0, y: 0 };
		const normal = { x: 0, y: 0 };
		// x축 대칭
		circlePos.y *= -1;
		if (0 < circlePos.x && 0 < circlePos.y) { // 1사분면
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.BALL_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.BALL_RADIUS * Math.sin(theta);
		}
		else if (0 > circlePos.x && 0 < circlePos.y) { // 2사분면
			circlePos.x *= -1;
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.BALL_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.BALL_RADIUS * Math.sin(theta);
			normal.x *= -1;
			newCirclePos.x *= -1;
		}
		else if (0 > circlePos.x && 0 > circlePos.y) { // 3사분면
			circlePos.x *= -1;
			circlePos.y *= -1;
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.BALL_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.BALL_RADIUS * Math.sin(theta);
			normal.x *= -1;
			normal.y *= -1;
			newCirclePos.x *= -1;
			newCirclePos.y *= -1;
		}
		else if (0 < circlePos.x && 0 > circlePos.y) { // 4사분면
			circlePos.y *= -1;
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.BALL_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.BALL_RADIUS * Math.sin(theta);
			normal.y *= -1;
			newCirclePos.y *= -1;
		}
		// 다시 x축 대칭!
		normal.y *= -1;
		newCirclePos.y *= -1;

		newCirclePos.x += this.WIDTH / 2;
		newCirclePos.y += this.HEIGHT / 2;
		if (Math.sqrt(normal.x ** 2 + normal.y ** 2) <= this.BALL_RADIUS) {
			// Matter.Body.setPosition(this.circle, newCirclePos);
			const velocity = Matter.Body.getVelocity(this.circle);
			if (normal.x * velocity.x + normal.y * velocity.y >= 0) {
				const theta = Math.atan2(normal.y, normal.x);
				const alpha = Math.atan2(velocity.y, velocity.x);
				const newVx = velocity.x * Math.cos(2 * theta - 2 * alpha) - velocity.y * Math.sin(2 * theta - 2 * alpha);
				const newVy = velocity.x * Math.sin(2 * theta - 2 * alpha) + velocity.y * Math.cos(2 * theta - 2 * alpha);
				Matter.Body.setVelocity(this.circle, { x: newVx * -1, y: newVy * -1 });
			}
		}
	}

	private ellipseLimit() {
		const circlePos = { x: this.myPaddle.position.x - this.WIDTH / 2, y: this.myPaddle.position.y - this.HEIGHT / 2 };
		const newCirclePos = { x: 0, y: 0 };
		const normal = { x: 0, y: 0 };
		// x축 대칭
		circlePos.y *= -1;
		if (0 < circlePos.x && 0 < circlePos.y) { // 1사분면
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.PADDLE_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.PADDLE_RADIUS * Math.sin(theta);
		}
		else if (0 > circlePos.x && 0 < circlePos.y) { // 2사분면
			circlePos.x *= -1;
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.PADDLE_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.PADDLE_RADIUS * Math.sin(theta);
			normal.x *= -1;
			newCirclePos.x *= -1;
		}
		else if (0 > circlePos.x && 0 > circlePos.y) { // 3사분면
			circlePos.x *= -1;
			circlePos.y *= -1;
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.PADDLE_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.PADDLE_RADIUS * Math.sin(theta);
			normal.x *= -1;
			normal.y *= -1;
			newCirclePos.x *= -1;
			newCirclePos.y *= -1;
		}
		else if (0 < circlePos.x && 0 > circlePos.y) { // 4사분면
			circlePos.y *= -1;
			const theta = this.oneQuadrantLogic(circlePos);
			const pointInEllipse = this.makePointInEllipse(theta);
			normal.x = pointInEllipse.x - circlePos.x;
			normal.y = pointInEllipse.y - circlePos.y;
			newCirclePos.x = pointInEllipse.x - this.PADDLE_RADIUS * Math.cos(theta);
			newCirclePos.y = pointInEllipse.y - this.PADDLE_RADIUS * Math.sin(theta);
			normal.y *= -1;
			newCirclePos.y *= -1;
		}
		// 다시 x축 대칭!
		normal.y *= -1;
		newCirclePos.y *= -1;

		newCirclePos.x += this.WIDTH / 2;
		newCirclePos.y += this.HEIGHT / 2;
		if (Math.sqrt(normal.x ** 2 + normal.y ** 2) <= this.PADDLE_RADIUS) {
			Matter.Body.setPosition(this.myPaddle, newCirclePos);
		}
	}

	private setEllipse() {
		const ellipseVerticesArray: Vector[] = [];
		const ellipseMajorAxis = this.HEIGHT;
		const ellipseMinorAxis = this.WIDTH;
		const ellipseVertices = 1000;

		for (let i = 0; i < ellipseVertices; i++) {
			const x = (ellipseMinorAxis / 2) * Math.cos(i);
			const y = (ellipseMajorAxis / 2) * Math.sin(i);
			ellipseVerticesArray.push({ x: x, y: y });
		}

		const ellipse = Matter.Bodies.fromVertices(this.WIDTH / 2, this.HEIGHT / 2, [ellipseVerticesArray], {
			isStatic: true,
			collisionFilter: {
				mask: this.lineCategory
			}
		});
		Matter.Composite.add(this.world, ellipse);
	}

	private limitVelocity() {
		//속도제한
		if (this.circle.velocity.x > 35) {
			Matter.Body.setVelocity(this.circle, {
				x: 35,
				y: this.circle.velocity.y,
			});
		}
		if (this.circle.velocity.y > 35) {
			Matter.Body.setVelocity(this.circle, {
				x: this.circle.velocity.x,
				y: 35,
			});
		}
	}

	private getScore() {
		//점수 겟또
		if (this.circle.position.y < this.BALL_RADIUS) {
			if (this.player === 1) {
				this.player1Score++;
			}
			else if (this.player === 2) {
				this.player2Score++;
			}
			Matter.Body.setPosition(this.circle, {
				x: this.WIDTH / 2,
				y: this.HEIGHT / 2,
			});
			Matter.Body.setVelocity(this.circle, { x: -15, y: -15 });
			Matter.Body.setAngularVelocity(this.circle, 0);
		} else if (this.circle.position.y > this.HEIGHT - this.BALL_RADIUS) {
			if (this.player === 1) {
				this.player2Score++;
			}
			else if (this.player === 2) {
				this.player1Score++;
			}
			Matter.Body.setPosition(this.circle, {
				x: this.WIDTH / 2,
				y: this.HEIGHT / 2,
			});
			Matter.Body.setVelocity(this.circle, { x: 15, y: 15 });
			Matter.Body.setAngularVelocity(this.circle, 0);
		}
	}

	private drawScore() {
		if (this.canvasContext === null)
			return;
		const player1DrawPos = this.player === 1 ? 1900 : 25
		const player2DrawPos = player1DrawPos === 1900 ? 25 : 1900
		this.canvasContext.fillText(
			"Player 2 score: " + this.player2Score + `/${this.WIN_SCORE}`,
			this.WIDTH / 2 - 150,
			player2DrawPos,
		);
		this.canvasContext.fillText(
			"Player 1 score: " + this.player1Score + `/${this.WIN_SCORE}`,
			this.WIDTH / 2 - 150,
			player1DrawPos,
		);
	}

	private judgeWinner() {
		if (this.canvasContext === null)
			return;
		if (this.player1Score >= this.WIN_SCORE) {
			this.canvasContext.fillText(
				"Player 1 Wins!",
				this.WIDTH / 2 - 100,
				this.HEIGHT / 2,
			);
			Matter.Engine.clear(this.engine);
			Matter.Render.stop(this.render);
			Matter.Runner.stop(this.runner);
		} else if (this.player2Score >= this.WIN_SCORE) {
			this.canvasContext.fillText(
				"Player 2 Wins!",
				this.WIDTH / 2 - 100,
				this.HEIGHT / 2,
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

	private sendFrame(paddle1Hit: boolean, paddle2Hit: boolean) {
		if (this.player1Score === this.WIN_SCORE || this.player2Score === this.WIN_SCORE) {
			return;
		}
		const myPaddle: PhysicsAttribute = {
			position: { x: this.myPaddle.position.x, y: this.myPaddle.position.y },
			velocity: { x: this.myPaddleVelocity.x, y: this.myPaddleVelocity.y },
		};
		const counterPaddle: PhysicsAttribute = {
			position: { x: this.counterPaddle.position.x, y: this.counterPaddle.position.y },
			velocity: { x: 0, y: 0 },
		}
		const frame: Frame = {
			id: this.frames.length,
			paddle1: this.player === 1 ? myPaddle : counterPaddle,
			paddle1Hit,
			paddle2: this.player === 1 ? counterPaddle : myPaddle,
			paddle2Hit,
			ball: {
				position: { x: this.circle.position.x, y: this.circle.position.y },
				velocity: { x: this.circle.velocity.x, y: this.circle.velocity.y },
			},
			player1Score: this.player1Score,
			player2Score: this.player2Score
		}
		if (this.player === 2) {
			this.reverseFrame(frame);
		}
		this.frames.push(frame);
		const buf = ByteBuffer.createWithOpcode(GameServerOpcode.FRAME);
		writeFrame(buf, frame);
		this.websocket.send(buf.toArray());
	}

	//gravity
	private attractive(attractiveBody: Matter.Body, body: Matter.Body, gravityConstant: number) {
		const normal = { x: attractiveBody.position.x - body.position.x, y: attractiveBody.position.y - body.position.y }
		const distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
		const force = { x: gravityConstant * normal.x / (distance * + 1), y: gravityConstant * normal.y / (distance + 1) };
		Matter.Body.setVelocity(body, { x: body.velocity.x + force.x / 3, y: body.velocity.y + force.y / 3 })
	}

	// private setGravity() {
	// 	// // gravity object
	// 	const attractiveBody1 = Matter.Bodies.circle(
	// 		700,
	// 		1200,
	// 		50,
	// 		{
	// 			isStatic: true,
	// 			collisionFilter: {
	// 				mask: this.lineCategory
	// 			}
	// 		});
	// 	const attractiveBody2 = Matter.Bodies.circle(
	// 		300,
	// 		650,
	// 		50,
	// 		{
	// 			isStatic: true,
	// 			collisionFilter: {
	// 				mask: this.lineCategory
	// 			}
	// 		});
	// 	Matter.Composite.add(this.world, [attractiveBody1, attractiveBody2]);
	// }

	start() {
		Matter.Render.run(this.render);
		this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
			const prevTimestamp = Date.now();
			const prevPointX = this.myPaddle.position.x;
			const prevPointY = this.myPaddle.position.y;
			const mousePos = this.calculateMousePos(event);
			this.myPaddleY = mousePos.y - this.PADDLE_RADIUS / 2;
			this.myPaddleX = mousePos.x - this.PADDLE_RADIUS / 2;
			Matter.Body.setPosition(this.myPaddle, { x: this.myPaddleX, y: this.myPaddleY });
			//패들 중앙선 침범 금지~!
			if (this.myPaddle.position.y < this.HEIGHT / 2 + this.PADDLE_RADIUS) {
				Matter.Body.setPosition(this.myPaddle, {
					x: this.myPaddle.position.x,
					y: this.HEIGHT / 2 + this.PADDLE_RADIUS,
				});
			}
			//타원 패들
			this.ellipseLimit();
			const deltaT = Date.now() - prevTimestamp + 1;
			this.myPaddleVelocity = {
				x: (this.myPaddle.position.x - prevPointX) / deltaT,
				y: (this.myPaddle.position.y - prevPointY) / deltaT,
			};
		});
		// //add Ellipse
		// this.setEllipse();
		// //중력객체 추가
		// this.setGravity();
		//add paddles
		Matter.Composite.add(this.world, this.myPaddle);
		Matter.Composite.add(this.world, this.counterPaddle);
		//add line
		Matter.Composite.add(
			this.world,
			Matter.Bodies.rectangle(this.WIDTH / 2, this.HEIGHT / 2, this.WIDTH, 2, {
				isStatic: true,
				collisionFilter: {
					mask: this.lineCategory,
				},
			}),
		);
		Matter.Runner.run(this.runner, this.engine);
		//add ball
		Matter.Composite.add(this.world, this.circle);
		Matter.Render.lookAt(this.render, {
			min: { x: 0, y: 0 },
			max: { x: this.WIDTH, y: this.HEIGHT },
		});

		// Event On!
		Matter.Events.on(this.runner, "tick", (_event: Event) => {
			// XXX
			if (this.canvasContext === null) {
				throw new Error("no canvas");
			}
			const collided = Matter.Collision.collides(this.myPaddle, this.circle, 0) ?? Matter.Collision.collides(this.counterPaddle, this.circle, 0);
			const velocity = Matter.Body.getVelocity(this.circle);
			let paddle1Hit = false;
			let paddle2Hit = false;

			if (collided?.collided === true) {
				if (collided.bodyA.position.y > this.HEIGHT / 2) {
					paddle1Hit = true;
				}
				else {
					paddle2Hit = true;
				}
				this.reflection(collided.normal, this.circle)
				Matter.Body.setVelocity(this.circle, {
					x: this.circle.velocity.x + this.myPaddleVelocity.x / 8,
					y: this.circle.velocity.y + this.myPaddleVelocity.y / 8,
				});
				this.myPaddleVelocity = { x: 0, y: 0 };
			}
			//paddle2의 속도추가
			Matter.Body.setPosition(this.counterPaddle, { x: this.counterPaddle.position.x + this.counterPaddleVelocity.x, y: this.counterPaddle.position.y + this.counterPaddleVelocity.y })
			//반사!
			this.wallReflection(velocity)
			// // 타원 반사!
			// this.ellipseReflection();
			// //점수 겟또
			// this.getScore();
			//속도제한
			this.limitVelocity();
			// //중력!
			// this.attractive(this.attractiveBody1, this.circle, 1);
			// this.attractive(this.attractiveBody2, this.circle, 0.5);

			// //프레임 보내기
			// this.sendFrame(paddle1Hit, paddle2Hit);

			//승점계산
			this.judgeWinner();
			this.drawScore();
		});
	}
}