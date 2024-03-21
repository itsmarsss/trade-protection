import React, { useEffect } from "react";
import "./styles.css";
import { useCanvas } from "../../hooks/useCanvas";

const Pagemap = ({ container, options }) => {
  const [canvasRef, setContainerRef, setDrag, drag] = useCanvas(options);

  useEffect(() => {
    setContainerRef(container.current);
  }, [container, setContainerRef]);

  const handleDrag = (ev) => {
    ev.preventDefault();
    window.scrollTo({
      left: ev.clientX / (options.width / window.innerWidth),
      top: ev.clientY / (options.height / window.innerHeight),
      behavior: "auto",
    });
  };

  const handleOnMouseMove = (ev) => {
    if (drag) {
      handleDrag(ev);
    }
  };

  const handleFinishDrag = () => {
    setDrag(false);
  };

  const handleOnMouseDown = (ev) => {
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
      style={{ cursor: "pointer" }}
    ></canvas>
  );
};

export default Pagemap;
