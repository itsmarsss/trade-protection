import { useEffect, useRef, useState } from "react";
import { resizeCanvas, draw } from "../utils/canvasUtils";

export function useCanvas(options) {
  const canvasRef = useRef(null);
  const [containerRef, setContainerRef] = useState(null);
  const [drag, setDrag] = useState(false);

  const onDraw = (ctx) => {
    if (containerRef) {
      draw(options, ctx, containerRef, drag);
    }
  };

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext("2d");

    options.height =
      document.body.scrollHeight * (options.width / document.body.scrollWidth);

    resizeCanvas(canvasObj, options.width, options.height);
    onDraw(ctx);

    const intervalId = setInterval(() => {
      onDraw(ctx);
    }, 50);

    return () => clearInterval(intervalId);
  });

  return [canvasRef, setContainerRef, setDrag, drag];
}
