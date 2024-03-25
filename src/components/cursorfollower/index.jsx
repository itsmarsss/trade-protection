import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

export default function CursorFollower() {
  const cursorRef = useRef(null);
  const currX = useRef(0);
  const currY = useRef(0);
  const original = useRef(1);

  const isTouchDevice = "ontouchstart" in window;
  useEffect(() => {
    const cursor = cursorRef.current;

    if (isTouchDevice || !cursor) {
      return;
    }

    window.addEventListener("mousemove", (e) => {
      const { target, x, y } = e;
      currX.current = x;
      currY.current = y;
      const isTargetLinkOrBtn =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest(".baritem") ||
        target.closest(".sidebar_option") ||
        target.closest(".pagemap") ||
        target.closest(".tooltip");
      gsap.to(cursor, {
        x: x - 10,
        y: y - 10,
        duration: 1,
        ease: "power4",
        opacity: isTargetLinkOrBtn ? 0.5 : 1,
        transform: `scale(${isTargetLinkOrBtn ? 3.5 : 1})`,
      });
      original.current = isTargetLinkOrBtn ? 3.5 : 1; 
    });

    document.addEventListener("mouseleave", () => {
      gsap.to(cursor, {
        duration: 1,
        opacity: 0,
      });
    });

    document.addEventListener("mousedown", (e) => {
      const { target, x, y } = e;
      const isTargetLinkOrBtn =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest(".baritem") ||
        target.closest(".sidebar_option") ||
        target.closest(".pagemap") ||
        target.closest(".tooltip");
      gsap.to(cursor, {
        x: x - 10,
        y: y - 10,
        duration: 1,
        ease: "power4",
        opacity: isTargetLinkOrBtn ? 0.25 : 0.5,
        transform: `scale(${isTargetLinkOrBtn ? 5.5 : 2})`,
      });
      original.current = isTargetLinkOrBtn ? 5.5 : 2; 
    });

    document.addEventListener("keydown", () => {
      gsap.to(cursor, {
        x: currX.current - 10,
        y: currY.current - 10,
        duration: 0.25,
        ease: "power4",
        opacity: 0.5,
        transform: `scale(0.3)`,
      });
    });

    document.addEventListener("keyup", () => {
      gsap.to(cursor, {
        x: currX.current - 10,
        y: currY.current - 10,
        duration: 0.25,
        ease: "power4",
        opacity: 0.5,
        transform: `scale(${original.current})`,
      });
    });
  }, []);
  return <cursor className="cursor_follower" ref={cursorRef}></cursor>;
}
