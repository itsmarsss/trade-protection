import { useEffect, useRef, useState } from "react";
import { resizeCanvas, draw } from "../utils/canvasUtils";

export function useCanvas(options) {
    const canvasRef = useRef(null);
    const [containerRef, setContainerRef] = useState(null);
    const [drag, setDrag] = useState(false);

    useEffect(() => {
        const canvasObj = canvasRef.current;
        const ctx = canvasObj.getContext("2d");
        resizeCanvas(canvasObj, options.width, options.height);

        //setInterval(() => {
        const handleDraw = () => {
            draw(options, ctx, containerRef, drag);
        };
        if (containerRef) {
            containerRef.addEventListener("scroll", handleDraw);
            containerRef.addEventListener("load", handleDraw);
            containerRef.addEventListener("resize", handleDraw);
            draw(options, ctx, containerRef);
        }
        //}, 10)
    });

    return [canvasRef, setContainerRef, setDrag, drag];
}
