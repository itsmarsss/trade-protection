import { useEffect, useRef, useState } from "react";
import { draw } from "../utils/canvasUtils";

export function useCanvas(options) {
  const canvasRef = useRef(null);
  const [containerRef, setContainerRef] = useState(null);
  const [drag, setDrag] = useState(false);

  const onDraw = (ctx, canvasObj) => {
    if (containerRef) {
      draw(options, ctx, containerRef, canvasObj, drag);
    }
  };

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext("2d");

    const intervalId = setInterval(() => {
      onDraw(ctx, canvasObj);
    }, 50);

    return () => clearInterval(intervalId);
  });

  return [canvasRef, setContainerRef, setDrag, drag];
}
