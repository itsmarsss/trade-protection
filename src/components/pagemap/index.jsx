import React, { useEffect, useRef } from "react";
import "./styles.css";
import { useCanvas } from "../../hooks/useCanvas";

const Pagemap = ({ container, options }) => {
  const [canvasRef, setContainerRef, setDrag, drag] = useCanvas(options);

  const coordYRef = useRef(0);

  useEffect(() => {
    setContainerRef(container.current);
  }, [container, setContainerRef]);

  const handleDrag = (ev) => {
    ev.preventDefault();
    const element = document.querySelector(".pagemap");
    const rect = element.getBoundingClientRect();
    const left =
      (ev.clientX - rect.left) /
      (options.width / container.current.scrollWidth);
    const top =
      (ev.clientY - rect.top) /
        (options.height / container.current.scrollHeight) -
      window.innerHeight / 2;

    window.scrollTo({
      left: left,
      top: top,
      behavior: "auto",
    });
  };

  const handleOnMouseMove = (ev) => {
    if (Math.abs(coordYRef.current - ev.clientY) < 10) {
      return;
    }
    document.documentElement.style.scrollBehavior = "auto";
    if (drag) {
      handleDrag(ev);
    }
  };

  const handleFinishDrag = () => {
    document.documentElement.style.scrollBehavior = "smooth";
    setDrag(false);
  };

  const handleOnMouseDown = (ev) => {
    coordYRef.current = ev.clientY;
    document.documentElement.style.scrollBehavior = "smooth";
    setDrag(true);
    handleDrag(ev);
  };

  return (
    <canvas
      className="pagemap"
      onMouseMove={handleOnMouseMove}
      onMouseUp={handleFinishDrag}
      onMouseLeave={handleFinishDrag}
      onMouseDown={handleOnMouseDown}
      ref={canvasRef}
    ></canvas>
  );
};

export default Pagemap;
