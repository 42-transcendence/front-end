import { useEffect, useRef } from "react";

export function GameInGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {}, []);
    return <canvas ref={canvasRef}></canvas>;
}
